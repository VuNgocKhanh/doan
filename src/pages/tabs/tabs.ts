import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Notification } from '../../providers/classes/notifications';
import { NotificationState } from '../../providers/manager/constant-manager';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  mNotifications: Array<Notification> = [];

  selectedIndex: number = 0;

  notificationUnread: number = 0;

  mUserID : number = -1;
  tab1Root = "HomePage";
  tab2Root = "LeaguePage";
  tab3Root = "NotificationPage";
  tab4Root = "UsersPage";

  constructor(
    public mAppModule: AppModuleProvider,
    public navParams: NavParams,
    private mAppmodule: AppModuleProvider,
  ) {
    this.onLoadParam();
  }

  ionViewDidLoad() {

    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("TabsPage", response => {
        this.onExtendsionRequest(response);
      })
    });

    this.mAppModule.getUserManager().getUserNotifications();
    this.notificationUnread = this.mAppModule.getUserManager().getUser().getUserStatistic().getNumberNotification();
  }

  ionViewWillUnload() {
    // Bd69SFSConnector.getInstance().removeListener("TabsPage");
  }

  onLoadParam() {
    if (this.navParams.get("params")) {
      this.selectedIndex = this.navParams.get("params");
    }
    if(this.navParams.data['userID']){
      this.mUserID = this.navParams.get('userID');
    }
  }

  onExtendsionRequest(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.ON_NEW_NOTIFICATION) {
      this.mAppModule.getUserManager().getUser().getUserStatistic().setNumberNotification(this.mAppModule.getUserManager().getUser().getUserStatistic().getNumberNotification() + 1);
      this.notificationUnread = this.mAppModule.getUserManager().getUser().getUserStatistic().getNumberNotification();
      // this.onNewNotifcation(params);
    } else if (cmd == Bd69SFSCmd.GET_USER_INFO) {
      this.notificationUnread = this.mAppModule.getUserManager().getUser().getUserStatistic().getNumberNotification();

    } else if (cmd == Bd69SFSCmd.READ_NOTIFICATION) {
      this.mAppModule.getUserManager().getUser().getUserStatistic().setNumberNotification(0);
      this.notificationUnread = this.mAppModule.getUserManager().getUser().getUserStatistic().getNumberNotification();
    }
  }

  onNewNotifcation(params) {
    let sfsdata = params.getSFSObject(ParamsKey.INFO);
    let newnotification = new Notification();
    newnotification.fromSFSObject(sfsdata);
  }

  onResponeNotification(params) {
    let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
    this.mAppModule.getUserManager().onResponeNotification(sfsArray);
    this.mNotifications = this.mAppModule.getUserManager().getUserNotification();

    this.notificationUnread = 0;
    for (let i = 0; i < this.mNotifications.length; i++) {
      if (this.mNotifications[i]['state'] == 1) {
        this.notificationUnread += 1;
      }
    }
  }

  resetNotify() {
    this.mAppModule.getUserManager().readNotification();
    this.notificationUnread = 0;
  }
}
