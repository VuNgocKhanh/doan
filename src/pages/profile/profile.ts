import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/classes/user';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ListModels {
  name: string;
  value: string;
}



@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {


  mListInfo: Array<ListModels> = [];

  mUser: User = new User();

  isUserOnDevice: boolean = true;

  numberDidEnter: number = 0;

  items: Array<{number: number, name: string, icon: string, color: string}> = [];

  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      if (this.navParams.get("params") != this.mAppModule.getUserManager().getUser().getUserID()) {
        this.isUserOnDevice = false;
      }
      this.mUser.setUserID(this.navParams.get("params"));

      console.log("userID: " , this.mUser.getUserID());
      
    } else {
      this.mUser = this.mAppModule.getUserManager().getUser();
      if (this.mUser.getLoginType() == -1) this.mUser.setLoginType(0);
      this.onParseUser();
    }
  }

  onLoadItems(){
    this.items = [
      {name: "Trận đấu", icon: "bd69-score",number: this.mUser.getUserStatistic().getNumberPlayed(),color: "green-color"},
      {name: "Bàn thắng", icon: "bd69-ball1",number: this.mUser.getUserStatistic().getNumberGoal(),color: "green-color"},
      {name: "Hỗ trợ", icon: "bd69-assist",number: this.mUser.getUserStatistic().getNumberAssist(),color: "green-color"},
      {name: "Đá chính", icon: "bd69-player",number: this.mUser.getUserStatistic().getNumberPlayFromStart(),color: "green-color"},
      {name: "Thẻ đỏ", icon: "bd69-card",number: this.mUser.getUserStatistic().getNumberRedCard(),color: "red-color"},
      {name: "Thẻ vàng", icon: "bd69-card",number: this.mUser.getUserStatistic().getNumberYellowCard(),color: "yellow-color"}
    ]
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onParseUser();
    }
    this.numberDidEnter++;
  }


  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.mAppModule.onSwithToLoading();
      return;
    }
    this.mAppModule._LoadAppConfig().then(()=>{
      this.mAppModule.addBd69SFSResponeListener("ProfilePage", (respone) => {
        this.onExtendsionRespone(respone);
      })

      Bd69SFSConnector.getInstance().sendRequestUserInfo(this.mUser.getUserID());
    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ProfilePage");
  }


  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_USER_INFO) {
      this.onResponeUserInfo(params);
    }
    else if (cmd == Bd69SFSCmd.UPDATE_USER_INFO) {
      this.onResponeUserInfo(params);
    }
  }

  onResponeUserInfo(params){
    this.mAppModule.hideLoading();
    
    if (params.getInt(ParamsKey.STATUS)) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        if(content.containsKey(ParamsKey.INFO)){
          let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
          let userstatistic = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.STATISTIC);
          this.mUser.fromSFSObject(info);
          this.mUser.getUserStatistic().fromSFSObject(userstatistic);

          if(this.mUser.getUserID() == this.mAppModule.getUserManager().getUser().getUserID()){
            this.mAppModule.getUserManager().getUser().fromSFSObject(info);
            this.mAppModule.getUserManager().getUser().getUserStatistic().fromSFSObject(userstatistic);
          }
        
          this.onParseUser();
          this.onLoadItems();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickEdit() {
    this.navCtrl.push("EditProfilePage", { params: this.mUser });
  }

  onParseUser() {
    this.mListInfo = [
      { name: "Ngày sinh", value: this.mUser.getBirthdayString() },
      { name: "Số điện thoại", value: this.mUser.getPhone() },

    ];
  }

  onClickAvatar() {
    if (!this.isUserOnDevice) return;
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mUser.getAvatar(), type: 1 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getUserManager().sendRequestUpdateUserAvatar(this.mUser.getUserID(), url);
        })
      }
    })
  }

  onClickCameraCover() {
    if (!this.isUserOnDevice) return;
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mUser.getCover(), type: 2 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getUserManager().sendRequestUpdateUserCover(this.mUser.getUserID(), url);
        });
      }
    })
  }
}
