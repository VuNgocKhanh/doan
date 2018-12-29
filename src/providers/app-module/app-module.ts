import { Injectable } from '@angular/core';
import { ModalController, App, AlertController, Platform, ActionSheetController, ToastController, LoadingController, Loading, Events, ViewController } from 'ionic-angular';
import { StorageController } from '../core/storage';
import { Storage } from '@ionic/storage';
import { APPKEYS } from './app-keys';
import { ClubManager } from '../manager/club-manager';
import { LeagueManager } from '../manager/league-manager';
import { UserManager } from '../manager/user-manager';
import { Config } from '../core/app/config';
import { WiadsHttpClient } from '../http/wiads-http-client';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Bd69SFSConnector } from '../smartfox/bd69-sfs-connector';
import { DeviceManager } from '../core/plugin/device-manager';
import { OneSignalManager } from '../core/plugin/onesignal-manager';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal'
import { NetworkInterface } from '@ionic-native/network-interface';
import { NetworkManager } from '../core/plugin/network-manager';
import { MatchesManager } from '../manager/matches-manager';
import { FacebookControllers } from '../core/common/facebook';
import { Facebook } from '@ionic-native/facebook';
import { NetworkConnectController } from '../core/network-connect/network-connect';
import { Network } from '@ionic-native/network';
import { Bd69SFSCmd } from '../smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../classes/paramkeys';
import { PlayerManager } from '../manager/player-manager';
import { ConstantManager, LOGIN_TYPE, RequestState, RoleInClub } from '../manager/constant-manager';
import { Notification } from '../classes/notifications';
import { UserInfo } from '../interface/userinfo';
import { resolve } from 'url';

@Injectable()
export class AppModuleProvider {
  private mLoading: Loading = null;
  mStorageController: StorageController = null;
  private mHttpClient: WiadsHttpClient;
  public mClubManager: ClubManager = new ClubManager();
  public mLeagueManager: LeagueManager = new LeagueManager();
  public mUserManager: UserManager = new UserManager();
  public mMatchManager: MatchesManager = new MatchesManager();
  private mFacebookController = new FacebookControllers();
  private mAppConfig: Config;
  mNetworkController: NetworkConnectController = new NetworkConnectController();
  private mPlayerManager = new PlayerManager();

  isLogin: boolean = false;
  constructor(
    public mApp: App,
    private mEvent: Events,
    private mNetwork: Network,
    private mLoadingController: LoadingController,
    private mFacebook: Facebook,
    private mToastController: ToastController,
    private mActionSheetController: ActionSheetController,
    private mNetworkInterface: NetworkInterface,
    private mOneSignal: OneSignal,
    private mDevice: Device,
    private mPlatform: Platform,
    public mAngularHttp: Http,
    public mNativeHttp: HTTP,
    public mAlertController: AlertController,
    public mStorage: Storage,
    public mModalController: ModalController
  ) {
    this.mFacebookController.setFaceBook(mFacebook);
    this.mNetworkController._setNetwork(this.mNetwork);
    this.mAppConfig = new Config();
    this.mHttpClient = new WiadsHttpClient();
    this.mStorageController = new StorageController();
    this.mStorageController.setStorage(mStorage);
  }

  getResouresPath(): string {
    return "http://";
  }

  getPlayerManager(): PlayerManager {
    return this.mPlayerManager;
  }

  getNetworkController() {
    return this.mNetworkController;
  }
  getFacebookController() {
    return this.mFacebookController;
  }

  getUserManager() {
    return this.mUserManager;
  }

  getMatchManager() {
    return this.mMatchManager;
  }
  getClubManager() {
    return this.mClubManager;
  }
  getLeagueManager() {
    return this.mLeagueManager;
  }
  getStoreController() {
    return this.mStorageController;
  }

  loginSucess() {
    return this.mStorageController.saveDataToStorage(APPKEYS.LOGIN_STATUS, true);
  }

  logout() {
    return this.mStorageController.removeKeyDataFromStorage(APPKEYS.LOGIN_STATUS);
  }

  async showLoading(content?: string, cssClass?: string, duration?: number) {
    if (this.mLoading) {
      try {
        await this.mLoading.dismiss()
      } catch (error) { }
    }
    this.mLoading = this.mLoadingController.create({
      duration: duration ? duration : 3000,
      dismissOnPageChange: true,
      content: content ? content : "Waiting...!",
      cssClass: cssClass ? cssClass : ""
    });
    this.mLoading.present();
  }

  async showLoadingNoduration(content?: string, cssClass?: string) {
    if (this.mLoading) {
      try {
        await this.mLoading.dismiss()
      } catch (error) { }
    }
    this.mLoading = this.mLoadingController.create({
      dismissOnPageChange: true,
      content: content ? content : "Waiting...!",
      cssClass: cssClass ? cssClass : ""
    });
    this.mLoading.present();
  }

  public hideLoading(): void {
    if (this.mLoading) {
      this.mLoading.dismiss();
      this.mLoading = null;
    }
  }

  showToast(message: string, duration?: number, position?: string) {
    this.mToastController.create({
      message: message,
      duration: duration ? duration : 2000,
      position: position ? position : "bottom"
    }).present();
  }

  showToastNotification(message: string, duration?: number, position?: string, cssClass?: any) {
    this.mToastController.create({
      message: message,
      duration: duration ? duration : 2000,
      position: position ? position : "bottom",
      cssClass: cssClass
    }).present();
  }
  /**page: Page, params: Params, callback: function after dimiss modal */
  public showModal(page, params?: any, callback?: any): void {
    let modal = this.mModalController.create(page, params ? params : null , {
      enterAnimation: 'fade-in',
      leaveAnimation: 'fade-out'
    });
    modal.present();
    modal.onDidDismiss((data) => {
      if (callback) {
        callback(data);
      }
    })
  }
  public showModalScale(page, params?: any, callback?: any): void {
    let modal = this.mModalController.create(page, params ? params : null, {
      enterAnimation: 'scale-up',
      leaveAnimation: 'scale-down'
    });
    modal.present();
    modal.onDidDismiss((data) => {
      if (callback) {
        callback(data);
      }
    })
  }
  /**page: Page, params: Params, callback: function after dimiss modal */
  public showModalIonic(page, params?: any, callback?: any): void {
    let modal = this.mModalController.create(page, params ? params : null);
    modal.present();
    modal.onDidDismiss((data) => {
      if (callback) {
        callback(data);
      }
    })
  }

  public showRadio(title: string, arrayInput: Array<{ id: any, name: string }>, idselected: any, callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    arrayInput.forEach(element => {
      alert.addInput({
        type: 'radio',
        label: element.name,
        value: element.id + "",
        checked: element.id == idselected ? true : false
      })
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {

        callback(data);
      }
    });
    alert.present();
  }

  public showRadioMulti(title: string, arrayInput: Array<{ id: number, name: string, checked: boolean }>, callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    arrayInput.forEach(item => {
      alert.addInput({
        type: 'checkbox',
        label: item.name,
        value: item.id + "",
        checked: item.checked
      })
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {

        callback(data)
      }
    });
    alert.present();
  }


  public showPromt(title: string, callback: any, value?: string, placeholder?: string, type?: string) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.addInput({
      name: "data",
      value: value ? value : "",
      type: type ? type : "text",
      placeholder: placeholder ? placeholder : "",
    });

    alert.addButton("Huỷ");
    alert.addButton({
      text: "Lưu",
      handler: data => {
        callback(data.data);
      }
    });

    alert.present();
  }

  public showAlert(title: string, callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.addButton({
      text: 'Cancel',
      handler: () => {
        callback(0);
      }
    });
    alert.addButton({
      text: 'Ok',
      handler: () => {
        callback(1);
      }
    });
    alert.present();
  }

  public showAlertTest(title: string, callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.addButton({
      text: 'Cancel',
      handler: () => {
        // this.mViewController.dismiss();
      }
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        callback(data);
      }
    });
    alert.present();
  }

  public showActionSheet(title: string, mArray: Array<{ id: number, name: string }>, callback: any) {
    let actionSheet = this.mActionSheetController.create();
    actionSheet.setTitle(title);
    mArray.forEach((element, index) => {
      actionSheet.addButton({
        text: element.name,
        role: (index == mArray.length - 1) ? "destructive" : "",
        handler: () => {
          callback(element.id);
        }
      })
    });
    actionSheet.addButton({
      text: "Thoát",
      role: "cancel",
      handler: () => {
        callback();
      }
    })
    actionSheet.present();
  }

  public showTextBoxUpdateResultMatch() {

  }

  getHttpClient() {
    return this.mHttpClient;
  }

  getAppConfig() {
    return this.mAppConfig;
  }
  public _LoadAppConfig() {
    this.getHttpClient().createClient(this.mAngularHttp, this.mNativeHttp);
    return new Promise((resolve, reject) => {
      if (this.getAppConfig().hasData()) {
        return resolve();
      } else {
        this.getHttpClient().getAngularHttp().request("assets/data/app.json").subscribe(
          response => {
            let dataObject = response.json();
            if (dataObject.config) {
              if (dataObject.config.get_config) {
                this.mPlatform.ready().then(() => {
                  if (this.mPlatform.platforms().indexOf("android") && dataObject.config.android) {
                    this.getHttpClient().getAngularHttp().request(dataObject.config.android).subscribe((androidRes) => {
                      this.onResponseConfig(androidRes.json());
                      return resolve();
                    }, error => {
                      this.onResponseConfig(dataObject);
                      return resolve();
                    })
                  }
                  if (this.mPlatform.platforms().indexOf("ios") && dataObject.config.ios) {
                    this.getHttpClient().getAngularHttp().request(dataObject.config.ios).subscribe((iosRes) => {
                      this.onResponseConfig(iosRes.json());
                      return resolve();
                    }, error => {
                      this.onResponseConfig(dataObject);
                      return resolve();
                    })
                  }
                })
              } else {
                this.onResponseConfig(dataObject);
                return resolve();
              }
            }

          },
          error => {
            return reject();
          }
        );
      }
    });
  }


  private onResponseConfig(dataObject) {
    this.getAppConfig().setData(dataObject);
    this.getHttpClient().setData(dataObject['server']);

    Bd69SFSConnector.getInstance().setData(dataObject['smartfox']);

    NetworkManager.getInstance().setData(dataObject['network']);
    NetworkManager.getInstance().setNetworkInterface(this.mNetworkInterface);

    DeviceManager.getInstance().setData(dataObject['device']);
    DeviceManager.getInstance().setDevice(this.mDevice);

    OneSignalManager.getInstance().setData(dataObject['onesignal']);
    OneSignalManager.getInstance().setOneSignal(this.mOneSignal);

  }

  _createEvent(key: string) {
    this.mEvent.publish(key);
  }

  _subcribleEvent(key: string, callback: any) {
    this.mEvent.subscribe(key, () => {
      callback();
    })
  }
  _unsubcribleEvent(key: string) {
    this.mEvent.unsubscribe(key);
  }

  addSFSResponeListener() {
    Bd69SFSConnector.getInstance().addListener("AppModuleProvider", response => {
      this.onExtensionResponse(response);
    });
  }

  addBd69SFSResponeListener(page: string, callback: any) {
    Bd69SFSConnector.getInstance().addListener(page, response => {
      callback(response);
    });
  }

  removeSFSListener(page: string) {
    Bd69SFSConnector.getInstance().removeListener(page);
  }

  showParamsMessage(params) {
    this.showToast(params.getUtfString(ParamsKey.MESSAGE));
  }


  doLogin(userInfo: UserInfo) {
    return new Promise((resolve, reject) => {
      if (userInfo.type_login == LOGIN_TYPE.FACEBOOK) {
        Bd69SFSConnector.getInstance().loginByFacebook(userInfo.facebookID, userInfo.userName, userInfo.avatar).then((params) => {
          Bd69SFSConnector.getInstance().addListenerForExtensionResponse();
          return resolve(params);
        }).catch((err) => {
          return reject(err);
        });
      } else {
        Bd69SFSConnector.getInstance().loginByPhoneNumber(userInfo.phoneNumber, userInfo.userName, userInfo.avatar).then((params) => {
          Bd69SFSConnector.getInstance().addListenerForExtensionResponse();
          return resolve(params);
        }).catch((err) => {
          return reject(err);
        });
      }
    });
  }

  getRootPage(): string{
    let roleOfUser: string  = ""+ this.getUserManager().getUser().getRole();
    let rootpages = this.getAppConfig().get("rootpage");
    if(roleOfUser in rootpages){
      return rootpages[roleOfUser];
    }
    return 'TabsPage';
  }

  onJoinRoomSuccess() {
    this.getClubManager().sendRequestGetClubOfUser();
    this.getLeagueManager().sendRequestGetLeagueOfUser();
    this.getUserManager().sendRequestUserInfo();
    this.getUserManager().sendRequestGetPlayerPositionList();
    Bd69SFSConnector.getInstance().sendRequestGetListClubOfManager();
  }
  onLoginSuccess(params) {
    this.isLogin = true;
    this.addSFSResponeListener();
    if (params) {
      let userdata = params["data"];
      let sfsUserData = userdata.getSFSObject(ParamsKey.CONTENT);
      this.getUserManager().getUser().fromSFSObject(sfsUserData);
      let roomToJoin = userdata.getUtfString(ParamsKey.ROOM);
      Bd69SFSConnector.getInstance().requestJoinRoom(roomToJoin).then((params) => {
        this.onJoinRoomSuccess();
      });
    }

    OneSignalManager.getInstance().getOneSignalClientID().then((respone) => {
      Bd69SFSConnector.getInstance().sendInformationDeviceToServer(OneSignalManager.getInstance().getOneSignalID(), DeviceManager.getInstance().getDeviceName(), DeviceManager.getInstance().getPlatform());
    }).catch(err => { });
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (cmd == Bd69SFSCmd.GET_USER_INFO) {
      this.onResponseGetUserInfo(params);
    } else if (cmd == Bd69SFSCmd.ON_NEW_NOTIFICATION) {
      this.onResponseNewNotification(params);
    } else if (cmd == Bd69SFSCmd.CONNECTION_LOST) {
      this.onResponseConnectionLost(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_PLAY_POSITION) {
      ConstantManager.getInstance().onResponePlayerPosition(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
    } else if (cmd == Bd69SFSCmd.GET_CLUB_OF_USER) {
      this.onResponseClubOfUser(params);
    } else if (cmd == Bd69SFSCmd.GET_LEAGUE_OF_USER) {
      this.onResponseLeagueOfUser(params);
    } else if (cmd == Bd69SFSCmd.GET_USER_STATISTIC) {
      this.onResponeGetUserStatistic(params);
    } else if( cmd == Bd69SFSCmd.GET_LIST_MANAGE){
      this.onResponeGetListManager(params);
    } else if (cmd == Bd69SFSCmd.USER_LOGOUT){
      this.onResponeUserLogout(params);
    }
  }

  onResponeGetListManager(params){
    if(params.getInt(ParamsKey.STATUS) == 1){
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.getUserManager().onResponeUserListManager(content);
      }
    }else{
      this.showParamsMessage(params);
    }
  }

  onResponseGetUserInfo(params) {
    if (params && params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let userStatisticData = content.getSFSObject(ParamsKey.STATISTIC);
        if (userStatisticData && userStatisticData.getInt(ParamsKey.USER_ID) == this.getUserManager().getUser().getUserID()) {
          this.getUserManager().getUser().getUserStatistic().fromSFSObject(userStatisticData);
        }
      }
    }else{
      this.showParamsMessage(params);
    }
  }

  onResponeGetUserStatistic(params) {
    if (params && params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content && content.getInt(ParamsKey.USER_ID) == this.getUserManager().getUser().getUserID()) {
        this.getUserManager().getUser().getUserStatistic().fromSFSObject(content);
      }
    }else{
      this.showParamsMessage(params);
    }
  }

  doSwithToManagerClubInLeague(){
    this.mApp.getRootNav().setRoot("ManagerAdminsClubPage");
  }

  
  doSwithToManagerApps(){
    this.mApp.getRootNav().setRoot("ManagerAppPage");
  }

  doSwithToLeagueManager(){
    this.mApp.getRootNav().setRoot("LeagueManagerPage");

  }

  onSwithToLoading(){
    this.mApp.getRootNav().setRoot("LoadingPage");
  }

  onResponseConnectionLost(params) {
    this.showToast("Mất kết nối đến server");
    Bd69SFSConnector.getInstance().onConnectionLost("");
    this.mApp.getRootNav().setRoot("LoadingPage");
  }

  onResponseNewNotification(params) {
    if (params && params.getInt(ParamsKey.STATUS) == 1) {
      let sfsdata = params.getSFSObject(ParamsKey.INFO);
      let newnotification = new Notification();
      newnotification.fromSFSObject(sfsdata);
      this.onHanlderUserNotifications(newnotification);
      let message = String(newnotification.getSenderName()) + " " + String(newnotification.getMessage()).replace("<strong>", "").replace("</strong>", "");
      this.showToastNotification(message, 3000, "top", "toast-notify");
    }else{
      this.showParamsMessage(params);
    }
  }

  onResponseClubOfUser(params) {
    if (params && params.getInt(ParamsKey.STATUS) == 1) {
      this.getClubManager().onResponeSFSArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
      this.getUserManager().onResponeClubOfUser(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
    }else{
      this.showParamsMessage(params);
    }
  }
  onResponseLeagueOfUser(params) {
    if (params && params.getInt(ParamsKey.STATUS) == 1) {
      this.getLeagueManager().onResponeSFSArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
    }else{
      this.showParamsMessage(params);
    }
  }

  onHanlderUserNotifications(notifications: Notification) {
    if (notifications.getType() == 7 || notifications.getType() == 8) {
      this.getLeagueManager().sendRequestGetLeagueOfUser();
      this.getUserManager().sendRequestGET_USER_STATISTIC(this.getUserManager().getUser().getUserID());
    } else if (notifications.getType() == 2) {
      if (notifications.getUserID() == this.getUserManager().getUser().getUserID()) {

      }
    }
  }

 
  onResponeUserLogout(params){
    if(params.getInt(ParamsKey.STATUS) == 1){
      Bd69SFSConnector.getInstance().disconnect().then(()=>{
        this.onSwithToLoading();
      })
    }else{
      this.showParamsMessage(params);
    }
  }

  doLogConsole(title: string, params){
    console.log(title ,params);
  }


  public showActionSheetNoDestruc(title: string, mArray: Array<{ id: number, name: string }>, callback: any) {
    let actionSheet = this.mActionSheetController.create();
    actionSheet.setTitle(title);
    mArray.forEach((element, index) => {
      actionSheet.addButton({
        text: element.name,
        handler: () => {
          callback(element.id);
        }
      })
    });
    actionSheet.addButton({
      text: "Thoát",
      role: "cancel",
      handler: () => {
        callback();
      }
    })
    actionSheet.present();
  }

  public getLogo(image: any): string {
    if(image != undefined || image.trim() != ""){
      return image;
    }else {
      return "./assets/imgs/no-image.png"
    }
  }

  public getCover(image: any): string {
    if(image != undefined || image.trim() != ""){
      return image;
    }else {
      return "./assets/imgs/match-default.png"
    }
  }

}
