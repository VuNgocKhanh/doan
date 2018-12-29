import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { UserInfo } from '../../providers/interface/userinfo';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { ConstantManager, UploadType } from '../../providers/manager/constant-manager';

import { normalizeURL } from 'ionic-angular';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { User } from '../../providers/classes/user';
import { Utils } from '../../providers/core/app/utils';


@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  @ViewChild("input") myInput;
  dateOfBirth: string = "1900-01-01";

  mUser: User = new User();

  selectedFile: any;

  imageFileName: string = "";

  isUploadAvatar: boolean = false;

  constructor(
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.mUser = this.mAppModule.getUserManager().getUser();
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["birthday"]) {
      this.dateOfBirth = this.navParams.get("birthday");
    } else {
      this.dateOfBirth = Utils.getRequestDate(new Date(this.mUser.getBirthday()));
    }
  }


  ionViewDidLoad() {
    this.mAppModule.addBd69SFSResponeListener("InfoPage", respone => {
      this.onExtensionRespone(respone);
    })

    setTimeout(() => {
      this.myInput.setFocus();
    }, 1000);
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("InfoPage");
  }



  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if (cmd == Bd69SFSCmd.UPDATE_USER_INFO) {
      this.onResponeUpdateUserInfo(params);
    }
    else if (cmd == Bd69SFSCmd.UPLOAD_IMAGE) {
      this.onResponeUploadImage(params);
    }
  }

  onResponeUpdateUserInfo(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          let info = content.getSFSObject(ParamsKey.INFO);
          if (this.isUploadAvatar) {
            this.mAppModule.showToast("Đang lưu ảnh ..");
            this.mAppModule.showLoadingNoduration();
          } else {
            this.mAppModule.showToast("Cập nhật thông tin thành công");
            this.mAppModule.getUserManager().getUser().fromSFSObject(info);
            this.doSwitchToRootPage();
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  onResponeUploadImage(params) {
    this.mAppModule.hideLoading();
    this.isUploadAvatar = false;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let array = content.getSFSArray(ParamsKey.ARRAY);
        if (array && array.getSFSObject(0)) {
          let url = array.getSFSObject(0).getUtfString(ParamsKey.URL);
          let avatar = this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url;
          this.mAppModule.getUserManager().sendRequestUpdateUserAvatar(this.mUser.getUserID(), avatar);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
      this.doSwitchToRootPage();
    }
  }

  onClickUpdate() {
    if (this.mUser.getName().trim() == "") {
      this.mAppModule.showToast("Hãy nhập tên của bạn.");
    } else {
      this.upLoadAvatar();
      this.mAppModule.showLoading().then(() => {
        let newDate = new Date(this.dateOfBirth);
        Bd69SFSConnector.getInstance().sendRequestUpdateUserInfo(this.mUser.getUserID(), null, null, this.mUser.getName(), newDate.getTime());
      });
    }
  }

  doSwitchToRootPage() {
    this.navCtrl.setRoot(this.mAppModule.getRootPage(), {}, {
      animate: true,
      animation: "replace"
    });
  }

  upLoadAvatar() {
    if (this.selectedFile || this.imageFileName.trim() != "") {
      this.isUploadAvatar = true;

      if (!DeviceManager.getInstance().isInMobileDevice()) {
        UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFile, UploadType.AVATAR, "true").then(() => {

        }).catch(err => { });
      } else {
        UploadFileModule.getInstance()._onUploadFileInDevice(this.mUser.getAvatar(), this.imageFileName, UploadType.AVATAR, "true").then(() => {

        }).catch((err) => { });
      }
    }
  }

  onClickAvatar() {
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;
          this.mUser.setAvatar(res.avatar);
        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload avatar", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType >= 0) {
          UploadFileModule.getInstance()._onTakeAPhotoWithType(sourceType, UploadType.AVATAR).then((res) => {
            if (res) {
              this.imageFileName = res.imageFileName;
              this.mUser.setAvatar(res.imageURI);
            }
          }).catch((err) => {
            this.mAppModule.showToast("Không lấy được file ảnh");
          });
        }
      })
    }
  }


  getNoramlizeString(avatar): string {
    return normalizeURL(avatar);
  }
}
