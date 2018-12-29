import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { ConstantManager, UploadType, DevicePlatform } from '../../providers/manager/constant-manager';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { normalizeURL } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-bd69-upload-image',
  templateUrl: 'bd69-upload-image.html',
})
export class Bd69UploadImagePage {

  /**type = 1 is avatar type = 2 is cover */
  type: number = 1;

  image: string = "";

  selectedFile: any;

  imageFileName: string = "";

  constructor(
    private mViewController: ViewController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();

  }

  ionViewDidLoad() {

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69UploadImagePage", respone => {
        this.onExtendsionRespone(respone);
      });
    })
  }
  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69UploadImagePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    this.mAppModule.hideLoading();

    if (cmd == Bd69SFSCmd.UPLOAD_IMAGE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {

        let array = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);

        if (array && array.getSFSObject(0)) {
          let url = array.getSFSObject(0).getUtfString(ParamsKey.URL);
          this.image = this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url;
          this.mViewController.dismiss(this.image);

        }

      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
  }

  onLoadParams() {

    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.image = params["image"];
      this.type = params["type"];
    }
  }

  onClickUpload() {
    if (DeviceManager.getInstance().isInMobileDevice()) {
      if (this.image && !this.image.startsWith("http")) {
        this.mAppModule.showToast("Đang lưu ảnh ...");
        this.mAppModule.showLoadingNoduration().then(() => {
          UploadFileModule.getInstance()._onUploadFileInDevice(this.image, this.imageFileName, this.type == 1 ? UploadType.AVATAR : UploadType.COVER, "true").then(() => {

          }).catch((err) => {
            this.mAppModule.hideLoading();
            this.mAppModule.showToast(err);
          })
        })
      }
    } else {
      if (this.image && !this.image.startsWith("http")) {
        this.mAppModule.showToast("Đang lưu ảnh ...");

        this.mAppModule.showLoadingNoduration().then(() => {
          UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFile, this.type == 1 ? UploadType.AVATAR : UploadType.COVER, "true").then(() => {
          }).catch(err => {
            this.mAppModule.hideLoading();
            this.mAppModule.showToast("Upload image fail ..", err);
          })
        })
      }
    }
  }

  onClickClose() {
    this.mViewController.dismiss();
  }

  onClickRefresh() {
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;
          this.image = res.avatar;
        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload avatar", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType == 0 || sourceType == 1) {
          UploadFileModule.getInstance()._onTakeAPhotoWithType(sourceType, UploadType.AVATAR).then((res) => {
            if (res) {
              this.imageFileName = res.imageFileName;
              this.image = res.imageURI;
            }
          }).catch((err) => {
            this.mAppModule.showToast("Không lấy được file ảnh");
          });
        }
      });
    }
  }

  getNormalizeImage() {
    return normalizeURL(this.image);
  }
}
