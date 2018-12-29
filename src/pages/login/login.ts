import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular'; import { AppModuleProvider } from '../../providers/app-module/app-module';
import { FbAccountKitController } from '../../providers/core/fb-accountkit/fb-accountkit';
import { LOGIN_TYPE } from '../../providers/manager/constant-manager';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { UserInfo } from '../../providers/interface/userinfo';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userInfo: UserInfo = {
    userName: "",
    avatar: "",
    phoneNumber: "",
    facebookID: "",
    type_login: -1
  };

  developer: string = "Developed by AppInAsia";

  dateOfBirth: string = "";
  constructor(
    public mAlertController: AlertController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

   ionViewDidEnter() {
    this.userInfo = {
      userName: "",
      avatar: "",
      phoneNumber: "",
      facebookID: "",
      type_login: -1
    };
    this.doLoadAppConfig();
  }

  doLoadAppConfig() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.onLoadConfigSucess();
    }).catch(() => {
      this.onLoadConfigFail();
    });
  }

  onLoadConfigSucess() { }

  onLoadConfigFail() {
    this.doSwitchToLoadingPage();
  }

  doLoginWithDefaultAccount(loginType: number) {
    if (loginType == -1) return;
    if (this.mAppModule.getAppConfig().get('user')) {
      this.userInfo = this.mAppModule.getAppConfig().get('user');
      this.userInfo.type_login = loginType;
      this.doConnectToServer(this.userInfo);
    }
  }

  onClickLoginByFacebook() {
    if (DeviceManager.getInstance().isInMobileDevice()) {
      this.mAppModule.getFacebookController().loginWithFacebook().then((params) => {
        if (params) {
          this.mAppModule.doLogConsole("Params api ...", params);
          this.userInfo.type_login = LOGIN_TYPE.FACEBOOK;
          this.userInfo.facebookID = params["id"];
          this.userInfo.userName = params["name"];
          this.userInfo.avatar = params["picture_large"]["data"]["url"];
          if(params["birthday"]){
            let birthday : string = params["birthday"];
            let arrayDates = birthday.split("/");
            this.dateOfBirth = arrayDates[2] +"-"+arrayDates[0]+"-"+arrayDates[1]; 
          }
          this.mAppModule.showLoadingNoduration().then(()=>{
            this.doConnectToServer(this.userInfo);
          })
        }
      }).catch(err => {
        this.mAppModule.showToast("Đăng nhập thất bại");
      });
    } else {
      this.doLoginWithDefaultAccount(LOGIN_TYPE.FACEBOOK);
    }
  }

  onClickLoginByPhone() {
    if (DeviceManager.getInstance().isInMobileDevice()) {
      FbAccountKitController._getIntance().register((params) => {
        if (params) {
          this.userInfo.type_login = LOGIN_TYPE.PHONE;
          this.userInfo.phoneNumber = params["phoneNumber"];
          this.userInfo.avatar = "";
          this.userInfo.userName = params["phoneNumber"];
          this.mAppModule.showLoadingNoduration().then(()=>{
            this.doConnectToServer(this.userInfo);
          })
        }
      });
    }
    else {
      this.doLoginWithDefaultAccount(LOGIN_TYPE.PHONE);
    }
  }

  onLoginSucess(params) {

    this.mAppModule.onLoginSuccess(params);
    this.mAppModule.getStoreController().saveDataToStorage(APPKEYS.USER_INFO, JSON.stringify(this.userInfo)).then((res) => { this.mAppModule.doLogConsole("Save user info success", null); });
    this.mAppModule.hideLoading();
    this.doSwithToInfoPage(this.userInfo.type_login);
  }

  doSwithToInfoPage(login_type: number){
    this.navCtrl.setRoot("InfoPage", { birthday : login_type == LOGIN_TYPE.FACEBOOK ? this.dateOfBirth : null });
  }

  doSwitchToLoadingPage() {
    this.navCtrl.setRoot("LoadingPage", {}, {
      animate: false
    });
  }

  doSwitchToRootPage() {
    this.navCtrl.setRoot(this.mAppModule.getRootPage(), {}, {
      animate: true,
      animation: "replace"
    });
  }

  doConnectToServer(userInfo: UserInfo) {
    Bd69SFSConnector.getInstance().connect().then((res) => {
      this.onConnectSucess(userInfo);
    }).catch((err) => {
      this.mAppModule.hideLoading();
      this.onConnectError(err);
    });
  }

  onConnectSucess(userinfo: UserInfo) {
    this.mAppModule.doLogin(this.userInfo).then((params)=>{
      this.onLoginSucess(params);
    }).catch((error)=>{
      this.mAppModule.hideLoading();
      let errorMessage : string= error.errorMessage;
      if(errorMessage){
        let messageObject : string  = errorMessage.substring(errorMessage.lastIndexOf("<<")+2,errorMessage.lastIndexOf(">>"));
        let data = JSON.parse(messageObject);
        if(data){
          let alert = this.mAlertController.create();
          alert.setTitle("Login failed!");
          alert.setMessage(data.em);
          alert.addButton("Ok");
          alert.present();
        }
      }
    });
  }

  onConnectError(err) {
    let alert = this.mAlertController.create();
    alert.setTitle("Connection error!");
    alert.setMessage("Cannot connect to server, please check your internet connection and try again.");
    alert.addButton({
      text: "Retry",
      handler: () => {
        this.onClickReconnectToServer();
      }
    });
    alert.present();
  }

  onClickReconnectToServer() {
    this.mAppModule.showLoadingNoduration().then(() => {
      this.doConnectToServer(this.userInfo);
    });
  }

}
