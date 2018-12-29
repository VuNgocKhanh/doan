import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/classes/user';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';

/**
 * Generated class for the UsersFacebookLinkedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-facebook-linked',
  templateUrl: 'users-facebook-linked.html',
})
export class UsersFacebookLinkedPage {
  mUser: User = new User();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    if (this.navParams.data["params"]) {
      this.mUser = this.navParams.get("params");
    }
    Bd69SFSConnector.getInstance().addListener("UsersFacebookLinkedPage", response =>{
      this.onExtensionRespone(response);
    });    
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("UsersFacebookLinkedPage");
  }

  onExtensionRespone(response){
    let cmd = response.cmd;
    let params = response.params;
    
    if(cmd == Bd69SFSCmd.UPDATE_USER_INFO){
      this.mAppModule.getUserManager().sendRequestUserInfo(this.mUser.getUserID());
    }

    if(cmd == Bd69SFSCmd.GET_USER_INFO){
      if(params.getInt(ParamsKey.STATUS) == 1){
        this.mUser.fromSFSObject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
        this.mAppModule.hideLoading();
      }
    }
  }

  linkFacebook() {
    this.mAppModule.showLoading();
    this.mAppModule.getFacebookController().loginWithFacebook().then(data => {
      
      this.mAppModule.getUserManager().sendRequestUpdateUserAvatar(this.mUser.getUserID(), data["picture_large"]["data"]["url"]);
      this.mAppModule.getUserManager().sendRequestUpdateFacebookId(this.mUser.getUserID(), data["id"]);
      
      // facebookID: data["id"],
      // userName: data["name"],
      // avatar: data["picture_large"]["data"]["url"]
    })
  }

  cancelLinkFacebook(){
    this.mAppModule.getUserManager().sendRequestUpdateUserAvatar(this.mUser.getUserID(), "./assets/default/player_avatar_default.png");
    this.mAppModule.getUserManager().sendRequestUpdateFacebookId(this.mUser.getUserID(), "");
    this.navCtrl.push("UsersPage");
  }

}
