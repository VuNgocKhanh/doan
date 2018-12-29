import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { UserInfo } from '../../providers/interface/userinfo';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { HttpClient } from '@angular/common/http';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';


@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  isLoadDataClub: boolean = false;
  isLoadDataLeague: boolean = false;
  constructor(
    public mCamera: Camera,
    public mFileTransfer: FileTransfer,
    public mHttpClient: HttpClient,
    public mSplashScreen: SplashScreen,
    public mPlatform: Platform,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController,
    public navCtrl: NavController, public navParams: NavParams
  ) {
    UploadFileModule.getInstance()._initiallize(mCamera, mFileTransfer, mHttpClient);
    // this.mAppModule.getStoreController().removeKeyDataFromStorage(APPKEYS.USER_INFO);
  }


  ionViewDidLoad() {
    this.mPlatform.ready().then(() => {
      this.onPlatformReady();
    });
  }

  ionViewWillUnload() {
    setTimeout(() => { this.mSplashScreen.hide(); }, 500);
  }

  onPlatformReady() {
    DeviceManager.getInstance().setInMobileDevice(!(this.mPlatform.is('core') || this.mPlatform.is('mobileweb')));
    if (DeviceManager.getInstance().isInMobileDevice()) {
      DeviceManager.getInstance().setPlatform(this.mPlatform.is("android") ? 1 : 2);
    }
    this.doLoadAppConfig();
  }

  doLoadAppConfig() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.onLoadConfigSucess();
    }).catch(() => {
      this.onLoadConfigFail();
    });
  }



  doSwitchToTabsPage() {
    this.navCtrl.setRoot(this.mAppModule.getRootPage(), {}, {
      animate: true,
      animation: "replace"
    });
  }

  doSwitchToLoginPage() {
    this.navCtrl.setRoot("LoginPage", {}, {
      animate: false
    });
  }


  onLoadConfigSucess() {
    this.mAppModule.getStoreController().getDataFromStorage(APPKEYS.USER_INFO).then((res) => {
      if (res) {
        let dataStorage = JSON.parse(res);
        let userInfo: UserInfo = dataStorage;
        this.doConnectToServer(userInfo);
      } else {
        this.doSwitchToLoginPage();
      }
    });
  }

  onLoadConfigFail() {
    this.mSplashScreen.hide();
    this.mAppModule.hideLoading();
    let alert = this.mAlertController.create();
    alert.setTitle("Network error!");
    alert.setMessage("Make sure that Wi-Fi or mobile data is turned on, then try again");
    alert.addButton({
      text: "Retry",
      handler: () => {
        this.onClickReloadConfig();
      }
    });
    alert.present();
  }

  onClickReloadConfig() {
    this.mAppModule.showLoading().then(() => {
      setTimeout(() => {
        this.doLoadAppConfig();
      }, 2000);
    });
  }

  doConnectToServer(userInfo: UserInfo) {
    Bd69SFSConnector.getInstance().connect().then((res) => {
      this.onConnectSucess(userInfo);
    }).catch((err) => {
      this.onConnectError(err);
    });
  }

  onConnectSucess(userinfo: UserInfo) {
    this.mAppModule.doLogin(userinfo).then((params) => {
      this.onLoginSucess(params);
    }, error => {
      this.doSwitchToLoginPage();
    });
  }

  onConnectError(err) {
    this.mSplashScreen.hide();
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
      this.onLoadConfigSucess();
    });
  }

  onLoginSucess(params) {
    this.mAppModule.onLoginSuccess(params);
    this.doSwitchToTabsPage();
  }
}
