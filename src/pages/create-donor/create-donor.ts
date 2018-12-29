import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Dornor } from '../../providers/classes/donnor';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { ConstantManager, UploadType } from '../../providers/manager/constant-manager';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { normalizeURL } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-create-donor',
  templateUrl: 'create-donor.html',
})
export class CreateDonorPage {


  mDonors: Dornor = new Dornor();

  selectedFile: any;

  avatarFileName: string = "";

  stepUpload: number = 3;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("CreateDonorPage", respone => {
        this.onExtendsionRespone(respone);
      })
    })
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.ADD_NEW_DORNOR) {
      this.onResponeAddNewDornor(params);
    } else if (cmd == Bd69SFSCmd.UPLOAD_IMAGE) {
      this.onResponeUploadImage(params);
    } else if (cmd == Bd69SFSCmd.UPDATE_DORNOR_INFO) {
      this.onResponeUpdateDornorInfo(params);
    }

  }

  onResponeUpdateDornorInfo(params) {
    this.stepUpload--;
    if (this.stepUpload == 0) this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mDonors.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          if (this.stepUpload == 0) this.mViewController.dismiss(this.mDonors);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUploadImage(params) {
    this.stepUpload--;
    if (this.stepUpload == 0) this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          let array = content.getSFSArray(ParamsKey.ARRAY);
          if (array.size() > 0) {
            let url = array.getSFSObject(0).getUtfString(ParamsKey.URL);
            this.mDonors.setLogo(this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url);
            Bd69SFSConnector.getInstance().sendRequestUPDATE_DORNOR_LOGO(this.mDonors);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddNewDornor(params) {
    this.stepUpload--;
    if (this.stepUpload == 0) this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mDonors.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          if (this.stepUpload == 0) this.mViewController.dismiss(this.mDonors);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("CreateDonorPage");
  }

  selectLogo() {
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;
          this.mDonors.setLogo(res.avatar);
        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload Logo", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType >= 0) {
          UploadFileModule.getInstance()._onTakeAPhotoWithType(sourceType, UploadType.LOGO).then((res) => {
            if (res) {
              this.avatarFileName = res.imageFileName;
              this.mDonors.setLogo(res.imageURI);
            }
          });
        }
      });
    }
  }

  checkForm() {
    if (this.mDonors.getName().length > 0) {
      this.mAppModule.showAlert("Bạn có muốn lưu lại không", (data) => {
        if (data && data == 1) {
          this.saveDonor();
        } else {
          this.mViewController.dismiss();
        }
      })
    } else {
      this.mViewController.dismiss();
    }
  }

  saveDonor() {
    if (this.mDonors.getName().length > 0) {
      this.mAppModule.showLoadingNoduration().then(() => {
        this.upLoadLogo();
        this.mAppModule.getUserManager().sendRequestAddNewDornor(this.mDonors);
      });
    } else {
      this.mAppModule.showToast("Bạn cần nhập tên nhà tài trợ để lưu");
    }
  }

  upLoadLogo() {
    if (this.mDonors.getLogo().length > 0 && (this.mDonors.getLogo().startsWith("file") || this.mDonors.getLogo().startsWith("data:image"))) {
      this.stepUpload = 3;
      if (DeviceManager.getInstance().isInMobileDevice()) {
        UploadFileModule.getInstance()._onUploadFileInDevice(this.mDonors.getLogo(), this.avatarFileName, UploadType.LOGO, "true").then(() => { }).catch(err => {
          this.mAppModule.showToast(err);
        });
      } else {
        UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFile, UploadType.LOGO, "true").then(() => { }).catch(err => {
          this.mAppModule.showToast(err);
        });
      }
    } else {
      this.stepUpload = 1;
    }
  }

  getNormalizeImage(url) {
    return normalizeURL(url);
  }
}
