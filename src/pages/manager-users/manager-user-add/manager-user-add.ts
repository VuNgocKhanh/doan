import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { DeviceManager } from '../../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../../providers/core/upload-image/upload-file';
import { ConstantManager, UploadType } from '../../../providers/manager/constant-manager';
import { normalizeURL } from 'ionic-angular/util/util';

/**
 * Generated class for the ManagerUserAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-user-add',
  templateUrl: 'manager-user-add.html',
})
export class ManagerUserAddPage {

  mUser: User = new User();

  selectedFile: any = null;

  mFileName: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {

  }

  onClickAddUser() {
    if (this.mUser.getName().trim() == "" || this.mUser.getName() == undefined) {
      this.mAppModule.showToast("Tên cầu thủ không được bỏ trống");
    } else if (this.mUser.getPhone().trim() == "" || this.mUser.getPhone() == undefined) {
      this.mAppModule.showToast("Số điện thoại không được bỏ trống");
    } else {

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
              this.mFileName = res.imageFileName;
              this.mUser.setAvatar(res.imageURI);
            }
          });
        }
      });
    }
  }

  getNormalizeImage() {
    return normalizeURL(this.mUser.getAvatar());
  }

}
