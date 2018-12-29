import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL, ViewController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Stadium } from '../../../providers/classes/stadium';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { DeviceManager } from '../../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../../providers/core/upload-image/upload-file';
import { ConstantManager, UploadType } from '../../../providers/manager/constant-manager';
import { AppManager } from '../../../providers/manager/app-manager';

/**
 * Generated class for the ManagerStadiumsAddstadiumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-stadiums-addstadium',
  templateUrl: 'manager-stadiums-addstadium.html',
})
export class ManagerStadiumsAddstadiumPage {
  mStadium: Stadium = new Stadium();

  selectedFile: any = null;

  mFileName: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerStadiumsAddstadiumPage", response => {
        this.onExtensionResponse(response);
      });
    });

  }

  ionViewWillUnLoad() {
    Bd69SFSConnector.getInstance().removeListener("ManagerStadiumsAddstadiumPagegit ");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.APP_ADD_NEW_STADIUM) {
      this.onResponseAPP_ADD_NEW_STADIUM(params);
    }
  }

  onResponseAPP_ADD_NEW_STADIUM(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.INFO)) {
        let sfsObject = content.getSFSObject(ParamsKey.INFO);
        this.mStadium.fromSFSobject(sfsObject);

        this.mViewController.dismiss(this.mStadium);
      }
    }
  }

  onClickLogo() {
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;
          this.mStadium.setLogo(res.avatar);
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
              this.mStadium.setLogo(res.imageURI);
            }
          });
        }
      });
    }
  }

  getNormalizeImage() {
    return normalizeURL(this.mStadium.getLogo());
  }
  isStadiumValid() {
    if (this.mStadium == null) return false;
    if (this.mStadium.getName().trim().length == 0) {
      return false;
    }
    return true;
  }
  addStadium() {
    if (this.mStadium.getName().trim() == "") {
      this.mAppModule.showToast("Tên sân vận động không được bỏ trống")
    } else if (this.mStadium.getAddress().trim() == "") {
      this.mAppModule.showToast("Địa chỉ sân vận động không được bỏ trống")
    } else {
      AppManager.getInstance().sendRequestAPP_ADD_NEW_STADIUM(this.mStadium);
    }
  }

}
