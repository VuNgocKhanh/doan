import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../providers/classes/league';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Player } from '../../providers/classes/player';
import { User } from '../../providers/classes/user';
import { Clubs } from '../../providers/classes/clubs';
import { PlayerCards } from '../../providers/classes/playercards';

/**
 * Generated class for the UserListProfliePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-list-proflie',
  templateUrl: 'user-list-proflie.html',
})
export class UserListProfliePage {


  mListPlayerCards: Array<PlayerCards> = [];

  mActionSheet: Array<any> = [
    { id: 0, name: "Cập nhật hồ sơ" },
    { id: 1, name: "Xem thông tin giải đấu" },
    { id: 2, name: "Xem toàn màn hình" },
  ];

  mNumberDidEnter : number = 0;

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("UserListProfliePage", respone => {
        this.onExtensionRespone(respone);
      });
      this.onLoadData();
    });

  }

  ionViewWillUnLoad() {
    Bd69SFSConnector.getInstance().removeListener("UserListProfliePage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_LIST_RECORD_OF_PLAYER) {
      this.onResponeGetListRecordOfPlayer(params);
    }
  }

  onLoadData() {
    this.mAppModule.getUserManager().sendRequestGET_LIST_RECORD_OF_PLAYER();
  }

  ionViewDidEnter(){
    if(this.mNumberDidEnter > 0){
      this.onLoadData();
    }
    this.mNumberDidEnter++;
  }


  onClickMemberCard(item: PlayerCards) {
    this.mAppModule.showActionSheet("Thông báo", this.mActionSheet, data => {
      if (data == 0) {
        this.navCtrl.push("ProfileUserPage", { players: { leagueID: item.getLeagueID(), playerID: item.getPlayerID() }, role: 1 });
      }
      else if (data == 1) {
        this.navCtrl.push("LeagueDetailPage", { params: item.getLeagueID() });
      }
      else if (data == 2) {
        // this.mAppModule.showModalScale("MemberCardPage", { params:  { league: item, club: this.mClub, user: this.mUser, listLeague: this.mListLeagues } });
        this.navCtrl.push("MemberCardPage", { params: item });
      }
    });
  }

  onResponeGetListRecordOfPlayer(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
          this.onParseListRecordPlayer(sfsArray);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListRecordPlayer(sfsArray) {
    if (sfsArray) {
      this.mListPlayerCards = [];
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsdata = sfsArray.getSFSObject(i);
        let newPlayerCards = new PlayerCards();
        newPlayerCards.onResponeSFSObject(sfsdata);
        newPlayerCards.onParseData();
        this.mListPlayerCards.push(newPlayerCards);
      }
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }
} 
