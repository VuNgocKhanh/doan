import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Player } from '../../../providers/classes/player';
import { User, LeagueSearchUsers } from '../../../providers/classes/user';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Utils } from '../../../providers/core/app/utils';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Clubs } from '../../../providers/classes/clubs';

/**
 * Generated class for the Bd69PlayersInleagueAddnewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface PlayerModels {
  player: Player;
  isMember: boolean;
}

@IonicPage()
@Component({
  selector: 'page-bd69-players-inleague-addnew',
  templateUrl: 'bd69-players-inleague-addnew.html',
})
export class Bd69PlayersInleagueAddnewPage {

  mListFillter: Array<{ id: number, name: string }> = [];

  mIDSelected: number = 2;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  page: number = 0;

  nextPage: number = 0;

  mLeagueID: number = -1;

  mClubID: number = -1;


  mListUser: Array<LeagueSearchUsers> = [];

  mListUserFillter: Array<LeagueSearchUsers> = [];

  mListPlayerFillter: Array<PlayerModels> = [];

  mListPlayer: Array<PlayerModels> = [];

  mListPlayerInLeague: Array<Player> = [];

  mListPlayerInClub: Array<Player> = [];

  isCaptain: boolean = false;

  mClub: Clubs = new Clubs();

  constructor(
    public mAlertController: AlertController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
    this.onLoadFillterOptions();
  }

  onLoadData() {
    if (this.isCaptain) {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_GET_LIST_PLAYER(this.mLeagueID, this.mClubID, -1);
    } else {
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_PLAYER(this.mLeagueID, this.mClubID, -1);
    }
    this.mAppModule.getClubManager().sendRequestGetPlayerInClub(this.mClubID, -1);
    Bd69SFSConnector.getInstance().sendRequestGetClubInfo(this.mClubID);
  }

  onClickOptionFillter(option) {
    this.mIDSelected = option.id;
    if (this.mIDSelected == 1) {
      this.nextPage = 0;
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, "a", this.nextPage);
    }
  }

  onLoadFillterOptions() {
    this.mListFillter = [
      { id: 2, name: "Trong câu lạc bộ" },
      { id: 1, name: "Tất cả" }
    ];
  }


  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mLeagueID = params["leagueID"];
      if (params["clubID"]) this.mClubID = params["clubID"];
      if (params["captain"]) this.isCaptain = params["captain"];
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69PlayersInleagueAddnewPage", respone => {
        this.onExtensionResponse(respone);
      })
      this.onLoadData();
    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69PlayersInleagueAddnewPage");
  }


  onParsePlayerInClub(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListPlayerInClub = this.mAppModule.getPlayerManager().onParsePlayer(params, clubID, leagueID);
          this.onLoadPlayerModels();

        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParsePlayerInLeagues(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListPlayerInLeague = this.mAppModule.getPlayerManager().onParsePlayer(params, clubID, leagueID);
          this.onLoadPlayerModels();

        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onParsePlayerInLeagues(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_GET_LIST_PLAYER) {
      this.onParsePlayerInLeagues(params);
    }
    else if (cmd == Bd69SFSCmd.GET_USER_IN_CLUB) {
      this.onParsePlayerInClub(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_USER) {
      this.onParseUser(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_ADD_PLAYER_INTO_LEAGUE) {
      this.onResponeAddPlayerIntoLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_PLAYER_FROM_LEAGUE) {
      this.onResponeRemovePlayerOutLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_ADD_PLAYER_INTO_LEAGUE) {
      this.onResponeAddPlayerIntoLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_REMOVE_PLAYER_FROM_LEAGUE) {
      this.onResponeRemovePlayerOutLeague(params);
    }
    else if (cmd == Bd69SFSCmd.GET_CLUB_INFO) {
      this.onResponeClubInfo(params);
    }
  }

  onResponeClubInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mClub.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRemovePlayerOutLeague(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Xoá thành viên thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        let playerID = content.getInt(ParamsKey.PLAYER_ID);

        let index = this.mListPlayerFillter.findIndex(player => {
          return player.player.getPlayerID() == playerID;
        })

        if (index > -1) {
          this.mListPlayerFillter[index].isMember = false;
        }

        let userIndex = this.mListUser.findIndex(user => {
          return user.getUserID() == playerID;
        });

        if (userIndex > -1) {
          this.mListUser[userIndex].resetClub();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  onResponeAddPlayerIntoLeague(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Thêm thành viên thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let playerID = content.getInt(ParamsKey.PLAYER_ID);

        let index = this.mListPlayerFillter.findIndex(player => {
          return player.player.getPlayerID() == playerID;
        })

        if (index > -1) {
          this.mListPlayerFillter[index].isMember = true;
        }

        let userIndex = this.mListUser.findIndex(user => {
          return user.getUserID() == playerID;
        });

        if (userIndex > -1) {
          this.mListUser[userIndex].setClub(this.mClubID, this.mClub.getName());
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  onCheckIsMember(playerID: number): boolean {
    if (this.mListPlayerInLeague.length == 0) return false;
    for (let player of this.mListPlayerInLeague) {
      if (player.getPlayerID() == playerID) {
        return true;
      }
    }
    return false;
  }

  onLoadPlayerModels() {
    this.mListPlayerFillter = [];
    this.mListPlayerInClub.forEach(player => {
      this.mListPlayerFillter.push({
        player: player,
        isMember: this.onCheckIsMember(player.getPlayerID())
      })
    });
    this.mListPlayer = this.mListPlayerFillter;
  }


  onParseUser(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);

        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayUser = this.mAppModule.getUserManager().onResponeLeagueSearchUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListUser = arrayUser;
          } else {
            this.mListUser = this.mListUser.concat(arrayUser);
          }

          this.mListUserFillter = this.mListUser;
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickPlayer(player: PlayerModels) {
    let options = [
      { id: 1, name: "Xem thông tin" },
    ];

    if (player.isMember) {
      options.push({id: 3, name: "Xóa khỏi giải đấu"});
    }else {
      options.push({id: 2, name: "Thêm vào giải đấu"});
    }
    this.mAppModule.showActionSheet(player.player.getName(), options, (id) => {
      if (id == 1) {
        this.navCtrl.push("ProfilePage", { params: player.player.getPlayerID() });
      }
      else if (id == 2) {
        this.doAddUser(player.player.getPlayerID());
      }
      else if (id == 3) {
        this.doRemoveUser(player.player.getPlayerID(), player.player.getName());
      }
    })
  }

  onClickUser(user: LeagueSearchUsers) {
    let options = [
      { id: 1, name: "Xem thông tin" }
    ];

    if (user.clubID > -1) {
      if (user.clubID == this.mClubID) {
        options.push(
          { id: 2, name: "Xoá khỏi giải đấu" }
        );
      }
    } else {
      options.push(
        { id: 2, name: "Thêm vào giải đấu" }
      );
    }



    this.mAppModule.showActionSheet(user.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.navCtrl.push("ProfilePage", { params: user.getUserID() });
        } else {
          if (user.clubID > -1) {
            this.doRemoveUser(user.getUserID(), user.getName());
          } else {
            this.doAddUser(user.getUserID());
          }
        }
      }
    })
  }

  doSearchLocal() {
    if (this.searchQuery.trim() != '') {
      if (this.mIDSelected == 1) {
        this.mListUser = this.mListUserFillter.filter(user => {
          return Utils.bodauTiengViet(user.getName()).toLowerCase().includes(Utils.bodauTiengViet(this.searchQuery).toLowerCase());
        })
      } else {
        this.mListPlayerFillter = this.mListPlayer.filter(user => {
          return Utils.bodauTiengViet(user.player.getName()).toLowerCase().includes(Utils.bodauTiengViet(this.searchQuery).toLowerCase());
        })
      }
    } else {
      if (this.mIDSelected == 1) {
        this.mListUser = this.mListUserFillter;
      } else {
        this.mListPlayerFillter = this.mListPlayer;
      }
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

      if (this.mIDSelected == 1) {
        if (infinite) {
          this.mAppModule.showLoading().then(() => {
            this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, this.searchQuery, this.nextPage);
          })
        } else {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, this.searchQuery, this.nextPage);

        }
      }
      // else{
      //   if (infinite) {
      //     this.mAppModule.showLoading().then(() => {
      //       this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID,this.searchQuery,this.nextPage);
      //     })
      //   } else {
      //     this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID,this.searchQuery,this.nextPage);

      //   }
      // }
    }
  }

  clearQuery() {
    this.nextPage = 0;
    this.mListUser = [];
    if (this.mIDSelected == 1) {
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, "a", this.nextPage);
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != '') {
        this.search();
      } else {
        // this.onLoadData();
        this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, "a", this.nextPage);
      }
      infiniteScroll.complete();
    }, 500);
  }

  doRemoveUser(userID: number, userName: string) {
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setMessage("Bạn muốn xóa cầu thủ " + userName + " khỏi giải đấu");
    alert.addButton({
      text: "Không"
    });
    alert.addButton({
      text: "Xóa",
      handler: () => {
        this.mAppModule.showLoading().then(() => {
          if (this.isCaptain) {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_REMOVE_PLAYER_FROM_LEAGUE(userID, this.mLeagueID, this.mClubID);
          } else {
            this.mAppModule.getLeagueManager().sendRequestLEAGUE_REMOVE_PLAYER_FROM_LEAGUE(userID, this.mLeagueID, this.mClubID);
          }
        })
      }
    });
    alert.present();


  }

  doAddUser(userID: number) {

    this.mAppModule.showLoading().then(() => {
      if (this.isCaptain) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_ADD_PLAYER_INTO_LEAGUE(userID, this.mLeagueID, this.mClubID);
      } else {
        this.mAppModule.getLeagueManager().sendRequestLEAGUE_ADD_PLAYER_INTO_LEAGUE(userID, this.mLeagueID, this.mClubID);
      }
    })

  }
}
