import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ConstantManager, LOGIN_TYPE, UploadType } from '../../providers/manager/constant-manager';
import { Clubs } from '../../providers/classes/clubs';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the EditClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-club',
  templateUrl: 'edit-club.html',
})
export class EditClubPage {

  mData: Clubs = new Clubs();

  isUpdateData : boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadData() {
    this.mAppModule.getUserManager().sendRequestGetClubInfo(this.mData.getClubID());
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("EditClubPage", respone => {
        this.onExtendsionRequest(respone);
      })
      this.onLoadData();
    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("EditClubPage");
  }

  onExtendsionRequest(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.GET_CLUB_INFO) {
      this.onResponeClubInfo(params);
    }

    if (cmd == Bd69SFSCmd.UPDATE_CLUB_INFO) {
      this.mAppModule.hideLoading();
      this.onResponeClubInfo(params);
    }

  }

  onResponeClubInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      if(this.isUpdateData){
        this.mAppModule.showToast("Thông tin đã được cập nhật");
        this.navCtrl.pop();
        return;
      }
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mData.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.mData.setClubID(this.navParams.get("params"));
    }
  }


  onClickSave() {
    if (this.mData.getDescription() == "" && this.mData.getSlogan() == "") {
      this.navCtrl.pop();
      return;
    }
    this.mAppModule.showLoading().then(() => {
      this.isUpdateData = true;
      this.mAppModule.getClubManager().sendRequestUpdateClubInfo(this.mData.getClubID(), null, this.mData.getDescription().trim() != "" ? this.mData.getDescription() : null, this.mData.getSlogan().trim() != "" ? this.mData.getSlogan() : null);
    })
  }


  onClickCameraCover() {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mData.getCover(), type: 2 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getClubManager().sendRequestUpdateClubCover(this.mData.getClubID(), url);
        });
      }
    })
  }

  onClickCameraLogo() {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mData.getLogo(), type: 1 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getClubManager().sendRequestUpdateClubLogo(this.mData.getClubID(), url);
        });
      }
    })
  }
}
