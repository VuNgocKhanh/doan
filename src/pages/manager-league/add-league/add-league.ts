import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL } from 'ionic-angular';
import { DeviceManager } from '../../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../../providers/core/upload-image/upload-file';
import { ConstantManager, UploadType } from '../../../providers/manager/constant-manager';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Leagues } from '../../../providers/classes/league';
import { AppManager } from '../../../providers/manager/app-manager';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the AddLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-league',
  templateUrl: 'add-league.html',
})
export class AddLeaguePage {

  selectedFile: any = null;
  mFileName: string = "";

  mLeague: Leagues = new Leagues();

  isUploadLogo: boolean = false;

  avatarFileName: string = "";

  numberClub: any = 0;

  image: string = "";

  isUploadImage: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    Bd69SFSConnector.getInstance().addListener("AddLeaguePage", respone => {
      this.onExtendtionRespone(respone);
    });
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("AddLeaguePage");
  }

  onExtendtionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.UPLOAD_IMAGE) {
      this.onResponeUploadImage(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_LEAGUE_INFO) {
      this.onResponeUpdateLeagueInfo(params);
    } else if (cmd == Bd69SFSCmd.APP_ADD_NEW_LEAGUE) {
      this.onResponseCreateLeague(params);
    }
  }

  onResponeUploadImage(params) {

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          let array = content.getSFSArray(ParamsKey.ARRAY);
          if (array.size() > 0) {
            let url = array.getSFSObject(0).getUtfString(ParamsKey.URL);
            let logo = this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url;
            this.mLeague.setLogo(logo);
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_LEAGUE_INFO(this.mLeague.getLeagueID(), this.mLeague);
          }
        }
      }
    } else {
      this.mAppModule.hideLoading();
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponseCreateLeague(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        this.mLeague.setLeagueID(leagueID);
        if (!this.isUploadImage) {
          this.onCreateLeagueSucess();
        } else {
          this.mAppModule.showToast("Đang upload ảnh..");
          this.mAppModule.showLoadingNoduration();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateLeagueInfo(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {


      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mLeague.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.onCreateLeagueSucess();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onCreateLeagueSucess() {
    this.mAppModule.showToast("Tạo giải đấu thành công");
    this.navCtrl.pop();
  }

  onClickLogo() {
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;
          this.mLeague.setLogo(res.avatar);
        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload avatar", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType >= 0) {
          UploadFileModule.getInstance()._onTakeAPhotoWithType(sourceType, UploadType.LOGO).then((res) => {
            if (res) {
              this.mFileName = res.imageFileName;
              this.mLeague.setLogo(res.imageURI);
            }
          });
        }
      });
    }
  }

  getNormalizeImage() {
    return normalizeURL(this.mLeague.getLogo());
  }

  onClickChosseType() {
    let listRadio = [
      { id: 0, name: "Phủi" },
      { id: 1, name: "Cup" },
      { id: 2, name: "League" }
    ]
    this.mAppModule.showRadio("Chọn loại giải đấu", listRadio, this.mLeague.getType(), res => {
      this.mLeague.setType(parseInt(res));
    })
  }


  getTimeStart(date) {
    let timeend = this.mLeague.getTimeEndDate();
    if (date.yy < timeend.yy || (date.mm < timeend.mm && date.yy <= timeend.yy) || timeend.dd == -1 || (date.dd < timeend.dd && date.mm <= timeend.mm && date.yy <= timeend.yy)) {
      let timestart = new Date(date.yy + "-" + ((date.mm + 1) < 10 ? "0" : "") + (date.mm + 1) + "-" + (date.dd < 10 ? "0" : "") + date.dd);
      this.mLeague.setTimeStart(timestart.getTime());
    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày bắt đầu nhỏ hơn ngày kết thúc");
    }
  }

  getTimeEnd(date) {
    let timeStart = this.mLeague.getTimeStartDate();

    if (date.yy > timeStart.yy || (date.mm > timeStart.mm && date.yy >= timeStart.yy) || timeStart.dd == -1 || (date.dd > timeStart.dd && date.mm >= timeStart.mm && date.yy >= timeStart.yy)) {
      let timeend = new Date(date.yy + "-" + ((date.mm + 1) < 10 ? "0" : "") + (date.mm + 1) + "-" + (date.dd < 10 ? "0" : "") + date.dd);
      this.mLeague.setTimeEnd(timeend.getTime());

    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày kết thúc lơn hơn ngày bắt đầu");
    }
  }

  createLeague() {
    if (this.numberClub > 0) {
      this.mLeague.setNumberClub(parseInt(this.numberClub));
    }
    if (this.mLeague.getName().trim() != "" && this.mLeague.getNumberClub() > 0 && this.mLeague.getTimeEnd() > 0 && this.mLeague.getTimeStart() > 0) {
      this.mAppModule.showLoading().then(() => {
        this.uploadImage();
        AppManager.getInstance().sendRequestAPP_ADD_NEW_LEAGUE(this.mLeague);

      });
    } else {
      this.mAppModule.showToast("Bạn chưa điền đầy đủ thông tin");
    }
  }

  uploadImage() {
    if (this.selectedFile || this.mFileName.length > 0) {
      this.isUploadImage = true;
      if (DeviceManager.getInstance().isInMobileDevice()) {
        UploadFileModule.getInstance()._onUploadFileInDevice(this.mLeague.getLogo(), this.mFileName, UploadType.LOGO, "true").then(() => {

        }).catch(err => {
          this.mAppModule.showToast(err);
          this.isUploadImage = false;
        });
      } else {
        UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFile, UploadType.LOGO, "true").then(() => {

        }).catch(err => {
          this.mAppModule.showToast(err);
          this.isUploadImage = false;
        });
      }
    } else {
      this.isUploadImage = false;
    }
  }

}
