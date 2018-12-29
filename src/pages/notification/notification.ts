import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Notification } from '../../providers/classes/notifications';
import { NotificationState, RoleInClub, NotificationType,RoleInLeague } from '../../providers/manager/constant-manager';
import { not } from '@angular/compiler/src/output/output_ast';
import { Content } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Clubs } from '../../providers/classes/clubs';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  @ViewChild(Content) content: Content;

  actionSheet: Array<any> = [
    { id: 0, name: "Đánh dấu đã đọc" },
    { id: 1, name: "Xóa" }
  ];
  mNotifications: Array<Notification> = [];

  nextPage: number = 0;
  constructor(
    private mAppmodule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.mAppmodule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("NotificationPage", respone => {
        this.onExtentsionRespone(respone);
      })
    })
    this.mAppmodule.getUserManager().getUserNotifications();
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("NotificationPage");
  }

  onExtentsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_REQUEST_USER_NOTIFICATION) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }
        this.onResponeNotification(params);
      } else {
        this.mAppmodule.showParamsMessage(params);
      }
    } else if (cmd == Bd69SFSCmd.ON_NEW_NOTIFICATION) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.onNewNotifcation(params);
      } else {
        this.mAppmodule.showParamsMessage(params);
      }
    }
  }

  onNewNotifcation(params) {
    let sfsdata = params.getSFSObject(ParamsKey.INFO);
    let newnotification = new Notification();
    newnotification.fromSFSObject(sfsdata);
    this.mNotifications.unshift(newnotification);
  }

  onResponeNotification(params) {
    let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
    let notifyArray = this.mAppmodule.getUserManager().onResponeNotification(sfsArray);
    if (this.nextPage < 1) {
      this.mNotifications = [];
    }
    this.mNotifications = this.mNotifications.concat(notifyArray);
  }

  goToSearch() {
    this.navCtrl.push("Bd69SearchPage");
  }

  showActionSheet(item: Notification, event) {

    event.cancelBubble = true;

    this.mAppmodule.showActionSheet("Thông báo", this.actionSheet, (data) => {
      // Click read noti
      if (data == 0) {
        item.setState(NotificationState.READ);
        this.mAppmodule.getUserManager().getRequestChangeStateNotification(item.getNotificationID(), item.getState());
      }
      // Click delete noti
      else if (data == 1) {
        item.setState(NotificationState.DELETED);
        this.mAppmodule.getUserManager().getRequestChangeStateNotification(item.getNotificationID(), item.getState());

        let index = this.mNotifications.findIndex(notify => {
          return notify.getNotificationID() == item.getNotificationID();
        })
        if (index > -1) {
          this.mNotifications.splice(index, 1);
        }
        this.mAppmodule.showToast("Đã xóa thông báo");
      }
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.mAppmodule.getUserManager().getUserNotifications(0);
      refresher.complete();
    }, 2000);
  }

  onClickNotification(notification: Notification) {

    if (notification.getState() == NotificationState.UNREAD) {
      notification.setState(NotificationState.READ);
      this.mAppmodule.getUserManager().getRequestChangeStateNotification(notification.getNotificationID(), notification.getState());
    }

    let notificationType = notification.getType();

    if (notificationType == NotificationType.REQUEST_JOIN_CLUB) {
      this.navCtrl.push("ManagerMemberPage", { params: notification.getTargetID() });
    }
    else if (notificationType == NotificationType.REQUEST_JOIN_CLUB_RESPONSE) {
      this.navCtrl.push("ViewClubPage", { params: { clubID: notification.getSenderID() } });
    }
    else if (notificationType == NotificationType.REQUEST_JOIN_LEAGUE) {
      this.navCtrl.push("Bd69ClubInleaguePage", { params: notification.getTargetID() });
    }
    else if (notificationType == NotificationType.REQUEST_JOIN_LEAGUE_RESPONSE) {
      this.navCtrl.push("LeagueDetailPage", { params: notification.getSenderID() });
    }
    else if (notificationType == NotificationType.ADD_USER_INTO_CLUB) {
      this.navCtrl.push("ViewClubPage", { params: { clubID: notification.getTargetID() } });
    }
    else if (notificationType == NotificationType.ADD_CLUB_INTO_LEAGUE) {
      this.navCtrl.push("LeagueDetailPage", { params: notification.getSenderID() });
    }
    else if (notificationType == NotificationType.ADD_PLAYER_INTO_LEAGUE) {
      this.navCtrl.push("LeagueDetailPage", { params: notification.getTargetID() });
    }
    else if (notificationType == NotificationType.REMOVE_PLAYER_INTO_LEAGUE) {
      this.navCtrl.push("LeagueDetailPage", { params: notification.getTargetID() });
    }
    else if (notificationType == NotificationType.REMOVE_CLUB_FROM_LEAGUE) {
      this.navCtrl.push("LeagueDetailPage", { params: notification.getSenderID() });
    }
    else if (notificationType == NotificationType.STATE_IN_CLUB_CHANGED) {
      this.navCtrl.push("LeagueDetailPage", { params: notification.getSenderID() });
    }
    else if (notificationType == NotificationType.PLAYER_RECORD_STATE_CHANGED) {
      this.navCtrl.push("LeagueDetailPage", { params: notification.getSenderID() });
    }
    else if (notificationType == NotificationType.LEAGUE_ADD_LEAGUE_ADMIN) {
      if (this.mAppmodule.getUserManager().getUser().getRole() == RoleInLeague.LEAGUEMANAGER) {
        this.navCtrl.push("LeagueManagerPage");
      }
    }
    else if (notificationType == NotificationType.CLUB_ADMIN_ADDED) {
      // if (this.mAppmodule.getUserManager().getRoleOfUserInClub(notification.getTargetID()) == RoleInClub.MANAGER) {
        this.navCtrl.push("ViewClubPage", { params: { clubID: notification.getTargetID() } });
      // }
    }
    else if (notificationType == NotificationType.LEAGUE_CLUB_ADMIN_ADDED) {
      // if (this.mAppmodule.getUserManager().getRoleOfUserInClubLeague(notification.getTargetID()) == RoleInClub.MANAGER) {
        this.navCtrl.push("ManagerAdminsClubDetailPage", { params: { clubID: notification.getTargetID(), leagueID: notification.getSenderID() } });
      // }
    }
    else if (notificationType == NotificationType.LEAGUE_ADD_EDITOR) {
      if (this.mAppmodule.getUserManager().getRoleOfUserInEditorLeague(notification.getSenderID()) == 1) {
        this.navCtrl.push("ManagerLeagueEditorToolPage", { params: notification.getSenderID() });
      }
    }
    else if (notificationType == NotificationType.SUBMIT_MATCH_RECORD) {
      this.navCtrl.push("ManagerLeagueRecordMatchPage", { params: { leagueID: notification.getSenderID(), matchID: notification.getTargetID(), mode: 2 } });
    }

  }

  scrollToTop() {
    this.content.scrollToTop();
    this.mAppmodule.mUserManager.readNotification();
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.mAppmodule.getUserManager().getUserNotifications(this.nextPage);
      infiniteScroll.complete();
    }, 500);
  }
}
