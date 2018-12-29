import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Referee } from '../../providers/classes/referee';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { RefereeManager } from '../../providers/manager/referee-manager';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { ConstantManager, UploadType } from '../../providers/manager/constant-manager';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the Bd69AddNewRefereePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-add-new-referee',
  templateUrl: 'bd69-add-new-referee.html',
})
export class Bd69AddNewRefereePage {

  mReferee: Referee = new Referee();

  selectedFile: any;

  fileName: string = "";

  isUploadPhoto: boolean = false;

  constructor(
    private mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69AddNewRefereePage", respone => {
        this.onExtendsionRespone(respone);
      });
    });
  }
  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69AddNewRefereePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    this.mAppModule.hideLoading();
    if (cmd == Bd69SFSCmd.ADD_NEW_REFEREE) {

      if (params.getInt(ParamsKey.STATUS) == 1) {
        let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
        this.mReferee.fromSFSObject(info);
        if (this.isUploadPhoto) {
          this.mAppModule.showLoadingNoduration();
        } else {
          this.mViewController.dismiss(this.mReferee);
        }
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
    if (cmd == Bd69SFSCmd.UPLOAD_IMAGE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let array = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);

        if (array && array.getSFSObject(0)) {
          let url = array.getSFSObject(0).getUtfString(ParamsKey.URL);
          this.mReferee.setAvatar(this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url);
          this.mAppModule.showLoading().then(() => {
            RefereeManager.getInstance().sendRequestUPDATE_REFEREE_AVATAR(this.mReferee.getRefereeID(), this.mReferee.getAvatar());
          });
        }
      } else {
        this.mAppModule.showParamsMessage(params);

      }
    }

    if (cmd == Bd69SFSCmd.UPDATE_REFEREE_INFO) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
        this.mReferee.fromSFSObject(info);
        this.mViewController.dismiss(this.mReferee);
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }

  }

  onClickSave() {
    if (this.mReferee.getName().trim() == '' || this.mReferee.getPhone().trim() == '') {
      this.mAppModule.showToast("Bạn cần điền đầy đủ thông tin");
    } else {
      this.mAppModule.showLoading().then(() => {
        this.uploadImage();
        RefereeManager.getInstance().sendRequestADD_NEW_REFEREE(this.mReferee);
      });
    }
  }

  uploadImage() {
    if (this.mReferee.getAvatar() && (this.mReferee.getAvatar().startsWith("file:") || this.mReferee.getAvatar().startsWith("data:"))) {
      this.isUploadPhoto = true;
      if (DeviceManager.getInstance().isInMobileDevice()) {
        UploadFileModule.getInstance()._onUploadFileInDevice(this.mReferee.getAvatar(), this.fileName, UploadType.AVATAR, "true").then(() => {

        }).catch(err => {
          this.mAppModule.showToast(err);
        })
      } else {
        UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFile, UploadType.AVATAR, "true").then(() => {

        }).catch(err => {
          this.mAppModule.showToast(err);
        })
      }
    }
  }

  onClickAvatar() {
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;

          this.mReferee.setAvatar(res.avatar);
        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload avatar", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType >= 0) {
          UploadFileModule.getInstance()._onTakeAPhotoWithType(sourceType, UploadType.AVATAR).then((res) => {
            if (res) {
              this.fileName = res.imageFileName;
              this.mReferee.setAvatar(res.imageURI);
            }
          }).catch((err) => {
            this.mAppModule.showToast(err);
          });
        }
      });
    }
  }
}
