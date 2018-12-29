import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Player } from '../../../providers/classes/player';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { ManagerClub } from '../../../providers/classes/clubs';

/**
 * Generated class for the ManagerLeaguePushNotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-league-push-notification',
  templateUrl: 'manager-league-push-notification.html',
})
export class ManagerLeaguePushNotificationPage {

  mLeagueID: number = -1;

  type: number = 1;

  message: string = "";

  mListPlayers: Array<Player> = [];

  mListManager: Array<ManagerClub> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_CLUB(this.mLeagueID);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerLeaguePushNotificationPage", respone => {
        this.onExtendsionRespone(respone);
      });

      this.onLoadData();
    });
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerLeaguePushNotificationPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_CLUB) {
      this.onResponeGetListClub(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_PUSH_NOTIFICATION) {
      this.onResponePushNotification(params);
    }
  }

  onResponeGetListClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let arraysClubs = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY), this.mLeagueID);
        this.mListManager = [];
        arraysClubs.forEach(club => {
          if (club.getManagerID() > -1) {
            this.mListManager.push(club.getManager());
          }
        });
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponePushNotification(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Đã gửi thông báo thành công tới các user trên hệ thống");
      this.navCtrl.pop();
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onClickAddPlayer() {
    this.mAppModule.showModalIonic("ManagerLeagueAddPlayerIntoNotificationPage", { params: this.mLeagueID, players: this.mListPlayers }, (mListPlayer) => {
      if (mListPlayer) {
        this.mListPlayers = mListPlayer;
      }
    });
  }


  onClickCheckMark() {

    if (this.message.length == 0) {
      this.mAppModule.showToast("Bạn chưa nhập nội dung thông báo");
      return;
    }
    if (parseInt(this.type + "") == 1) {
      if (this.mListManager.length == 0) {
        this.mAppModule.showToast("Không có lãnh đội để gửi thông báo");
        return;
      }
      this.mAppModule.showLoading().then(() => {
        let arrayIDs = [];
        this.mListManager.forEach(manager => {
          arrayIDs.push(manager.getManagerID());
        });
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_PUSH_NOTIFICATION(this.mLeagueID, this.message, arrayIDs);
      });

    } else {
      this.mAppModule.showLoading().then(() => {
        let arrayIDs = [];
        this.mListPlayers.forEach(player => {
          arrayIDs.push(player.getPlayerID());
        });
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_PUSH_NOTIFICATION(this.mLeagueID, this.message, arrayIDs);
      });
    }


  }

}
