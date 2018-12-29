import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { Player } from '../../../providers/classes/player';
import { Utils } from '../../../providers/core/app/utils';
import { RoleInClub } from '../../../providers/manager/constant-manager';

/**
 * Generated class for the Bd69ClubInleagueUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-club-inleague-update',
  templateUrl: 'bd69-club-inleague-update.html',
})
export class Bd69ClubInleagueUpdatePage {

  mClubInLeague: ClubInLeague = new ClubInLeague();

  numberDidEnter: number = 0;

  mListFillter: Array<{ id: number, name: string }> = [];

  mIDSelected: number = 1;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  page: number = 0;

  nextPage: number = 0;

  mListPlayers: Array<Player> = [];
  mListPlayersFillter: Array<Player> = [];

  mListItems1: Array<{ name: string, value: string }> = [];
  mListItems2: Array<{ name: string, value: string }> = [];

  leadID: number = -1;
  hideLead: boolean = false;

  constructor(
    private mAlertController: AlertController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
    this.onLoadFillterOptions();
  }


  onLoadFillterOptions() {
    this.mListFillter = [
      { id: 1, name: "Thành viên" },
      { id: 2, name: "Thành tích" }
    ];
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onLoadData();
    }
    this.numberDidEnter++;
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_CLUB_INFO(this.mClubInLeague.getLeagueID(), this.mClubInLeague.getClubID());
    this.onLoadPlayerInLeague();
  }

  onLoadPlayerInLeague() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER(this.mClubInLeague.getLeagueID(), this.mClubInLeague.getClubID(), -1);
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mClubInLeague.setLeagueID(params["leagueID"]);
      this.mClubInLeague.setClubID(params["clubID"]);
    }
  }


  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }
    Bd69SFSConnector.getInstance().addListener("Bd69ClubInleagueUpdatePage", respone => {
      this.onExtensionResponse(respone);
    })

    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69ClubInleagueUpdatePage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_CLUB_INFO) {
      this.onResponeGetClubInLeagueInfo(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onResponeArrayPlayerParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_PLAYER) {
      this.onResponeArrayPlayerParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_PLAYER_FROM_LEAGUE) {
      this.onResponeRemovePlayerOutLeague(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_CLUB_MANAGER) {
      this.onResponeUpdateClubManager(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_CLUB_INFO) {
      this.onResponeUpdateClubInfo(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_UPDATE_PLAYER_ROLE) {
      this.onResponeUpdatePlayerRole(params);
    }

  }



  onResponeGetClubInLeagueInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mClubInLeague.onFromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.onLoadMListItem();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdatePlayerRole(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.getSFSObject(ParamsKey.INFO).getInt(ParamsKey.ROLE_IN_CLUB) == 1) {
        this.mListPlayersFillter.forEach(player => {
          if (player.getRoleInClub() == 1) {
            player.setRoleInClub(0);
          }
        });
        let playerID = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayersFillter.findIndex(player => {
          return player.getPlayerID() == playerID
        });
        if (index > -1) {
          this.mListPlayersFillter[index].setRoleInClub(1);
        }
      } else {
        let playerID = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayersFillter.findIndex(player => {
          return player.getPlayerID() == playerID
        });
        if (index > -1) {
          this.mListPlayersFillter[index].setRoleInClub(0);
        }
      }
    }
    this.mAppModule.hideLoading();
  }

  onResponeArrayPlayerParams(params) {
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
          let arrayPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params, this.mClubInLeague.getClubID(), this.mClubInLeague.getLeagueID());
          if (this.page < 1) {
            this.mListPlayers = arrayPlayers;
          } else {
            this.mListPlayers = this.mListPlayers.concat(arrayPlayers);
          }
          this.mListPlayers.sort((a, b) => {
            if (a.getName() > b.getName()) return -1;
            if (a.getName() < b.getName()) return 1;
            return 0;
          });
          this.mListPlayersFillter = this.mListPlayers;
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
        let index = this.mListPlayers.findIndex(player => {
          return player.getPlayerID() == playerID;
        })

        if (index > -1) {
          this.mListPlayers.splice(index, 1)
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  onResponeUpdateClubManager(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let playerID = content.getInt(ParamsKey.MANAGER_ID);
        let index = this.mListPlayers.findIndex(player => {
          return player.getPlayerID() == playerID;
        })

        this.mListPlayersFillter.forEach(player => {
          if (player.getRoleInClub() == 2) {
            player.setRoleInClub(0);
          }
        })

        let indexLead = this.mListPlayersFillter.findIndex(player => {
          return player.getPlayerID() == this.leadID;
        });

        if (indexLead > -1 && this.hideLead) {
          this.mListPlayersFillter[indexLead].setRoleInClub(1);
        }

        if (index > -1) {
          this.mAppModule.showToast("Cập nhật thành công " + this.mListPlayers[index].getName() + " làm lãnh đội.");
          this.mClubInLeague.setManagerID(playerID);
          this.mClubInLeague.getManager().setAvatar(this.mListPlayers[index].getAvatar());
          this.mClubInLeague.getManager().setName(this.mListPlayers[index].getName());
          this.mClubInLeague.getManager().setManagerID(this.mListPlayers[index].getPlayerID());

          if (this.mListPlayersFillter[index].getRoleInClub() == 1) {
            this.hideLead = true;
            this.leadID = this.mListPlayersFillter[index].getPlayerID();
            this.mListPlayersFillter[index].setRoleInClub(2);
          } else {
            this.hideLead = false;
            this.mListPlayersFillter[index].setRoleInClub(2);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateClubInfo(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mAppModule.showToast("Cập nhật thông tin thành công");
          this.isEdit = false;
          this.mClubInLeague.onFromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.onLoadMListItem();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickAddPlayer() {
    this.navCtrl.push("Bd69PlayersInleagueAddnewPage", { params: { leagueID: this.mClubInLeague.getLeagueID(), clubID: this.mClubInLeague.getClubID() } });
  }

  onClickPlayer(player: Player) {
    let options = [
      { id: 1, name: "Xem thông tin " },
      { id: 2, name: "Xem hồ sơ" },
      { id: 3, name: "Chọn làm lãnh đội" },
      { id: 4, name: "Chọn làm đội trưởng" },
      { id: 5, name: "Xóa khỏi đội bóng" },
    ];
    if (player.getRoleInClub() == 1) {
      options[3] = { id: 4, name: "Hủy làm đội trưởng" };
    }

    this.mAppModule.showActionSheet(player.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToPlayerInfo(player);
        } else if (id == 2) {
          this.goToPlayerProfile(player);
        } else if (id == 3) {
          this.doUpdateManager(player);
        }
        else if (id == 4) {
          this.doUpdateRolePlayer(player);
        } else {
          this.doRemovePlayer(player);
        }
      }
    });
  }

  goToPlayerInfo(player: Player) {
    this.navCtrl.push("PlayerInfoPage", { params: { leagueID: this.mClubInLeague.getLeagueID(), clubID: this.mClubInLeague.getClubID(), playerID: player.getPlayerID() } });
  }

  goToPlayerProfile(player: Player) {
    this.navCtrl.push("ProfileUserPage", { players: { leagueID: this.mClubInLeague.getLeagueID(), playerID: player.getPlayerID() }, role: 2 });
  }

  doUpdateManager(player: Player) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_UPDATE_CLUB_MANAGER(player.getPlayerID(), this.mClubInLeague.getClubID(), this.mClubInLeague.getLeagueID());
    })
  }

  doUpdateRolePlayer(player: Player) {
    this.mAppModule.showLoading().then(() => {
      if (player.getRoleInClub() == 1) {
        this.mAppModule.getLeagueManager().senRequestLEAGUE_CLUB_UPDATE_PLAYER_ROLE(this.mClubInLeague.getLeagueID(), this.mClubInLeague.getClubID(), player.getPlayerID(), RoleInClub.MEMBER);
        this.mAppModule.showToast("Hủy đội trưởng thành công");
      }
      else {
        this.mAppModule.getLeagueManager().senRequestLEAGUE_CLUB_UPDATE_PLAYER_ROLE(this.mClubInLeague.getLeagueID(), this.mClubInLeague.getClubID(), player.getPlayerID(), RoleInClub.CAPTAIN);
        this.mAppModule.showToast("Chọn đội trưởng thành công");
      }
    })
  }

  doRemovePlayer(player: Player) {
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setMessage("Bạn muốn xóa cầu thủ " + player.getName() + " khỏi đội bóng");
    alert.addButton({
      text: "Không"
    });
    alert.addButton({
      text: "Xóa",
      handler: () => {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_REMOVE_PLAYER_FROM_LEAGUE(player.getPlayerID(), this.mClubInLeague.getLeagueID(), this.mClubInLeague.getClubID());
        })
      }
    });
    alert.present();
  }


  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != '') {
        this.onClickSearch();
      } else {
        this.onLoadPlayerInLeague();
      }
      infiniteScroll.complete();
    }, 500);
  }

  doSearchLocal() {
    if (this.searchQuery.trim() != '') {
      this.mListPlayersFillter = this.mListPlayers.filter(player => {
        return Utils.bodauTiengViet(player.getName()).toLowerCase().includes(Utils.bodauTiengViet(this.searchQuery).toLowerCase());
      })
    } else {
      this.mListPlayersFillter = this.mListPlayers;
    }
  }

  onClickSearch(infinite?: boolean) {

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
          Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_PLAYER(this.mClubInLeague.getLeagueID(), this.searchQuery, this.nextPage);
        })
      } else {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_PLAYER(this.mClubInLeague.getLeagueID(), this.searchQuery, this.nextPage);
      }
    }
  }

  onClickOptionFillter(option) {
    this.mIDSelected = option.id;
  }

  isEdit: boolean = false;

  onInput() {
    if (this.isEdit) return;
    this.isEdit = true;
  }

  onClickUpdate() {
    this.mClubInLeague.setPlayed(parseInt(this.mListItems1[0].value));
    this.mClubInLeague.setWon(parseInt(this.mListItems1[1].value));
    this.mClubInLeague.setLost(parseInt(this.mListItems1[2].value));
    this.mClubInLeague.setDrawn(parseInt(this.mListItems1[3].value));
    this.mClubInLeague.setGoalsFor(parseInt(this.mListItems1[4].value));
    this.mClubInLeague.setGoalsAgainst(parseInt(this.mListItems1[5].value));
    this.mClubInLeague.setRedCardNumber(parseInt(this.mListItems1[6].value));
    this.mClubInLeague.setYellowCardNumber(parseInt(this.mListItems1[7].value));

    this.mAppModule.showLoading().then(() => {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_CLUB_INFO(this.mClubInLeague);
    })
  }

  onLoadMListItem() {
    this.mListItems1 = [
      { name: "Số trận đấu", value: this.mClubInLeague.getPlayed() + "" },
      { name: "Số trận thắng", value: this.mClubInLeague.getWon() + "" },
      { name: "Số trận thua", value: this.mClubInLeague.getLost() + "" },
      { name: "Số trận hoà", value: this.mClubInLeague.getDrawn() + "" },
      { name: "Số bàn thắng", value: this.mClubInLeague.getGoalsFor() + "" },
      { name: "Số bàn thua", value: this.mClubInLeague.getGoalsAgainst() + "" },
      { name: "Số thẻ đỏ", value: this.mClubInLeague.getRedCardNumber() + "" },
      { name: "Số thẻ vàng", value: this.mClubInLeague.getYellowCardNumber() + "" }
    ];

    this.mListItems2 = [
      { name: "Lãnh đội", value: this.mClubInLeague.getShowman() },
      { name: "Email", value: this.mClubInLeague.getEmail() },
      { name: "Điện thoại", value: this.mClubInLeague.getHotline() },
    ];

  }

}
