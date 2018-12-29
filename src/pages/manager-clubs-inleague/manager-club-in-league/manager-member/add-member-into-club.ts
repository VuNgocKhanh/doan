import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Player } from '../../../../providers/classes/player';
import { AppModuleProvider } from '../../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../../../providers/smartfox/bd69-sfs-connector';
import { Utils } from '../../../../providers/core/app/utils';

/**
 * Generated class for the AddMemberIntoClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-member-into-club',
  templateUrl: 'add-member-into-club.html',
})
export class AddMemberIntoClubPage {


  mLeagueID: number = -1;

  mClubID: number = -1;

  numberDidEnter: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  // page: number = 0;

  // nextPage: number = 0;

  mListPlayer: Array<Player> = [];
  mListPlayerFilter: Array<Player> = [];


  isDidEnter: number = 0;

  mListActionSheets: Array<{ id: number, name: string }> = [];

  constructor(
    public mAlertController: AlertController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mLeagueID = params["leagueID"];
      this.mClubID = params["clubID"];
    }
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_GET_LIST_PLAYER(this.mLeagueID, this.mClubID, -1);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("AddMemberIntoClubPage", respone => {
        this.onExtensionResponse(respone);
      })

      this.onLoadData();

    });

  }

  ionViewDidEnter() {
    if (this.isDidEnter == 1) {
      this.onLoadData();
    }
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("AddMemberIntoClubPage");
  }


  onExtensionResponse(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_CLUB_GET_LIST_PLAYER) {
      this.onResponeGetListPlayer(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_PLAYER) {
      this.mAppModule.hideLoading();
      this.onResponeGetListPlayer(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_REMOVE_PLAYER_FROM_LEAGUE) {
      this.mAppModule.hideLoading();
      this.onResponeRemovePlayerOutLeague(params);
    }
  }

  onResponeGetListPlayer(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        // if (content.containsKey(ParamsKey.NEXT)) {
        //   this.nextPage = content.getInt(ParamsKey.NEXT);
        // } else {
        //   this.nextPage = -1;
        // }
        // if (content.containsKey(ParamsKey.PAGE)) {
        //   this.page = content.getInt(ParamsKey.PAGE);
        // }
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params, clubID, leagueID);
          // if (this.page < 1) {
          this.mListPlayer = arrayPlayers;
          this.mListPlayerFilter = arrayPlayers;
          // } else {
          // this.mListPlayer = this.mListPlayer.concat(arrayPlayers);
          // }
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRemovePlayerOutLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content) {
        let playerID = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayer.findIndex(player => {
          return player.getPlayerID() == playerID;
        })

        if (index > -1) {
          this.mAppModule.showToast("Đã xoá thành viên " + this.mListPlayer[index].getName() + " khỏi giải đấu");
          this.mListPlayer.splice(index, 1);
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickSearch() {
    this.mListPlayerFilter = this.mListPlayer.filter(player => {
      return Utils.bodauTiengViet(player.getName()).toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
    });
    // this.nextPage = 0;
    // this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, this.searchQuery, this.nextPage);
  }

  onClickAdd() {
    this.isDidEnter = 1;
    this.navCtrl.push("Bd69PlayersInleagueAddnewPage", { params: { leagueID: this.mLeagueID, clubID: this.mClubID, captain: true } });
  }

  onClickPlayer(player: Player) {
    if (this.mAppModule.getUserManager().getUser().getUserID() == player.getPlayerID()) {
      this.mListActionSheets = [
        { id: 0, name: "Xem thông tin" }
      ];
    } else {
      this.mListActionSheets = [
        { id: 0, name: "Xem thông tin" },
        { id: 1, name: "Xóa câu thủ khỏi đội bóng" },
      ]
    }
    this.mAppModule.showActionSheet(player.getName(), this.mListActionSheets, (res) => {
      if (res == 0) {
        this.onClickUserInfo(player);
      } else if (res == 1) {
        this.onClickRemovePlayer(player);
      }
    });
  }

  onClickUserInfo(player: Player) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.showModalIonic("ProfilePage", { params: player.getPlayerID() });
    });
  }

  onClickRemovePlayer(player: Player) {
    this.mAppModule.showLoading().then(() => {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_REMOVE_PLAYER_FROM_LEAGUE(player.getPlayerID(), this.mLeagueID, this.mClubID);
    });
  }

  // doInfinite(infiniteScroll) {
  //   setTimeout(() => {

  //     this.onLoadData();

  //     infiniteScroll.complete();
  //   }, 1000);
  // }

  doRefresh(refresher) {
    setTimeout(() => {

      // this.nextPage = 0;
      this.onLoadData();

      refresher.complete();
    }, 1500);
  }

}
