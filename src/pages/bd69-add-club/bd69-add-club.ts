import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Clubs } from '../../providers/classes/clubs';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { ConstantManager, UploadType } from '../../providers/manager/constant-manager';
import { normalizeURL } from 'ionic-angular';
import { AppManager } from '../../providers/manager/app-manager';

/**
 * Generated class for the Bd69AddClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-add-club',
  templateUrl: 'bd69-add-club.html',
})
export class Bd69AddClubPage {


  mClub: Clubs = new Clubs();

  selectedFile: any = null;

  mFileName: string = "";

  isUploadImage: boolean = false;

  constructor(
    public mViewController: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) { }

  ionViewDidLoad() {
    Bd69SFSConnector.getInstance().addListener("Bd69AddClubPage", respone => {
      this.onExtendtionRespone(respone);
    })
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("Bd69AddClubPage");
  }

  onExtendtionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.UPLOAD_IMAGE) {
      this.onResponeUploadImage(params);
    } else if (cmd == Bd69SFSCmd.APP_UPDATE_CLUB_INFO) {
      this.onResponeUpdateClubInfo(params);
    } else if (cmd == Bd69SFSCmd.APP_ADD_NEW_CLUB) {
      this.onResponeCreateClub(params);
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
            Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_LOGO_CLUB(this.mClub.getClubID(), logo);
          }
        }
      }
    } else {
      this.mAppModule.hideLoading();
      this.mAppModule.showParamsMessage(params);
      this.onCreateClubSucess();
    }
  }

  onResponeCreateClub(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        let clubID = content.getInt(ParamsKey.CLUB_ID);
        this.mClub.setClubID(clubID);

        this.mAppModule.getClubManager().addClub(this.mClub);

        if (!this.isUploadImage) {
          this.onCreateClubSucess();
        } else {
          this.mAppModule.showToast("Đang upload ảnh..");
          this.mAppModule.showLoadingNoduration();
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateClubInfo(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {


      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mClub.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.onCreateClubSucess();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  createClub() {
    if (this.mClub.getName().length > 0) {
      this.mAppModule.showLoading().then(() => {
        this.uploadImage();
        AppManager.getInstance().sendRequestAPP_ADD_NEW_CLUB(this.mClub);
      });
    } else {
      this.mAppModule.showToast("Bạn cần nhập tên đội bóng");
    }
  }

  onClickLogo() {
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;
          this.mClub.setLogo(res.avatar);
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
              this.mClub.setLogo(res.imageURI);
            }
          });
        }
      });
    }
  }

  onCreateClubSucess() {
    this.mAppModule.showToast("Tạo câu lạc bộ thành công");
    this.navCtrl.pop();
  }

  getNormalizeImage() {
    return normalizeURL(this.mClub.getLogo());
  }

  uploadImage() {
    if (this.selectedFile || this.mFileName.length > 0) {
      this.isUploadImage = true;
      if (DeviceManager.getInstance().isInMobileDevice()) {
        UploadFileModule.getInstance()._onUploadFileInDevice(this.mClub.getLogo(), this.mFileName, UploadType.LOGO, "true").then(() => {

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
