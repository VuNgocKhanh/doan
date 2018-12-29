import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Player } from '../../../providers/classes/player';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the Bd69PlayersInleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-players-inleague',
  templateUrl: 'bd69-players-inleague.html',
})
export class Bd69PlayersInleaguePage {

  mListActionSheets: Array<{ id: number, name: string }> = [];

  mLeagueID: number = -1;

  numberDidEnter: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  page: number = 0;

  nextPage: number = 0;

  mListPlayer: Array<Player> = [];

  constructor(
    public mAlertController: AlertController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadActionSheet();
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onLoadData() {
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_PLAYER(this.mLeagueID, null, this.nextPage);
  }


  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onLoadData();
    }
    this.numberDidEnter++;
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69PlayersInleaguePage");
  }


  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69PlayersInleaguePage", respone => {
        this.onExtensionResponse(respone);
      })
      this.onLoadData();
    })
  }

  onExtensionResponse(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onResponeGetListPlayer(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_PLAYER) {
      this.mAppModule.hideLoading();
      this.onResponeGetListPlayer(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_PLAYER_FROM_LEAGUE) {
      this.mAppModule.hideLoading();
      this.onResponeRemovePlayerOutLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_CLUB) {
      this.onParseClubInLeague(params);
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
          this.mListPlayer.splice(index, 1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetListPlayer(params) {



    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content) {

        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);

        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params, clubID, leagueID);
          if (this.page < 1) {
            this.mListPlayer = arrayPlayers;
          } else {
            this.mListPlayer = this.mListPlayer.concat(arrayPlayers);
          }
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  search(infinite?: boolean) {
    if (this.searchQuery.trim() != '') {
      if (this.searchQuery != this.oldSearchQuery) {
        this.oldSearchQuery = this.searchQuery;
        this.nextPage = 0;
        this.page = 0;
      }

      if (this.nextPage == -1) {
        return;
      }

      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID, this.searchQuery, this.nextPage);
      }
    }
  }

  clearQuery() {
    this.searchQuery = "";
    this.nextPage = 0;
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID, this.searchQuery, this.nextPage);

  }

  doSearchLocal() {
    if (this.searchQuery.trim() == "") {
      this.nextPage = 0;
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID, this.searchQuery, this.nextPage);
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != '') {
        this.search();
      } else {
        this.onLoadData();
      }
      infiniteScroll.complete();
    }, 500);
  }

  onLoadActionSheet() {
    this.mListActionSheets = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Xem hồ sơ" },
      { id: 3, name: "Xoá khỏi giải đấu" }
    ];
  }

  onClickPlayer(player: Player) {
    this.mAppModule.showActionSheet(player.getName(), this.mListActionSheets, (id) => {
      if (id) {
        if (id == 1) {
          this.goToPlayerInfo(player);
        } else if (id == 2) {
          this.goToPlayerProfile(player);
        } else {
          this.doRemovePlayerOutLeague(player);
        }
      }
    })
  }

  goToPlayerInfo(player: Player) {
    this.navCtrl.push("ProfilePage", { params: player.getPlayerID() });
  }

  goToPlayerProfile(player: Player) {
    this.navCtrl.push("ProfileUserPage", { players: { leagueID: this.mLeagueID, playerID: player.getPlayerID() } });
    // this.navCtrl.push("ProfilePlayerPage", { params: player.getPlayerID() });
  }

  doRemovePlayerOutLeague(player: Player) {
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setMessage("Bạn muốn xóa cầu thủ " + player.getName() + " khỏi giải đấu");
    alert.addButton({
      text: "Không"
    });
    alert.addButton({
      text: "Xóa",
      handler: () => {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_REMOVE_PLAYER_FROM_LEAGUE(player.getPlayerID(), this.mLeagueID, player.getClubID());
        });
      }
    });
    alert.present();
  }

  onClickAdd() {
    this.mAppModule.showLoading().then(() => {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_CLUB(this.mLeagueID);
    });
  }

  onParseClubInLeague(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          let clubs = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          let options = [];
          clubs.forEach(club => {
            options.push({
              id: club.getClubID(),
              name: club.getName()
            });
          });
          this.mAppModule.showRadio("Chọn câu lạc bộ", options, null, (clubID) => {
            if (clubID) {
              this.navCtrl.push("Bd69PlayersInleagueAddnewPage", { params: { leagueID: this.mLeagueID, clubID: parseInt(clubID) } });
            }
          });
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }


}
