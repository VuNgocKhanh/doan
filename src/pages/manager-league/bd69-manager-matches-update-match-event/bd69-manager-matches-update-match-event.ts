import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Match } from '../../../providers/classes/matches';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { MatchState, ConstantManager, MatchEventType } from '../../../providers/manager/constant-manager';
import { MatchEvent } from '../../../providers/classes/mathchevent';
import { Player } from '../../../providers/classes/player';

/**
 * Generated class for the Bd69ManagerMatchesUpdateMatchEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-manager-matches-update-match-event',
  templateUrl: 'bd69-manager-matches-update-match-event.html',
})
export class Bd69ManagerMatchesUpdateMatchEventPage {

  mMatch: Match = new Match();

  mListFillter: Array<{ id: number, name: string, disable: boolean }> = [];

  mIDSelected: number = 1;

  mListMatchEvents: Array<MatchEvent> = [];

  mClubIDSelected: number = -1;

  mListPlayerStart: Array<Player> = [];

  mListPlayerOther: Array<Player> = [];

  mListHomePlayers: Array<Player> = [];

  mListAwayPlayers: Array<Player> = [];

  numberDidEnter: number = 0;

  constructor(
    public mChangeDetectorRef: ChangeDetectorRef,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
    this.onLoadFillterOptions();
    this.onLoadEventItems();
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_MATCH_INFO(this.mMatch.getLeagueID(), this.mMatch.getMatchID());
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mMatch.setLeagueID(params["leagueID"]);
      this.mMatch.setMatchID(params["matchID"]);
    }
  }

  onLoadFillterOptions() {
    this.mListFillter = [
      { id: 1, name: "Diễn biến", disable: false },
      { id: 2, name: "Đội hình", disable: false }
    ];
  }

  onClickOptionFillter(option, $event) {
    this.mIDSelected = option.id;
    if (this.mIDSelected > 1) this.onLoadPlayerInMatch();
  }

  onClickClub(clubID: number) {
    this.mClubIDSelected = clubID;
    this.onLoadPlayerInMatch();
  }

  onLoadPlayerInMatch() {
    let arrayPlayersIDs = [];
    let arrayPlayers: Array<Player> = [];
    this.mListPlayerStart = [];
    this.mListPlayerOther = [];

    if (this.mClubIDSelected == this.mMatch.getHomeID()) {
      arrayPlayersIDs = this.mMatch.getHomeClub().getPlayersInMatch();
      arrayPlayers = this.mListHomePlayers;
    } else {
      arrayPlayersIDs = this.mMatch.getAwayClub().getPlayersInMatch();
      arrayPlayers = this.mListAwayPlayers;
    }

    if (arrayPlayersIDs.length == 0) return;

    arrayPlayers.forEach(player => {
      let check = false;
      for (let i = arrayPlayersIDs.length - 1; i >= 0; i--) {
        if (player.getPlayerID() == arrayPlayersIDs[i]) {
          check = true;
          this.mListPlayerStart.push(player);
          arrayPlayersIDs.splice(i, 1);
          break;
        }
      }
      if (!check) {
        this.mListPlayerOther.push(player);
      }
    })
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onLoadData();
    }
    this.numberDidEnter++;
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("Bd69ManagerMatchesUpdateMatchEventPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
    })

  }

  onLoadPlayers() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER(this.mMatch.getLeagueID(), this.mMatch.getHomeID(), -1);
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER(this.mMatch.getLeagueID(), this.mMatch.getAwayID(), -1);
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69ManagerMatchesUpdateMatchEventPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_MATCH_INFO) {
      this.onResponeMatchInfo(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_MATCH_EVENT) {
      this.onResponeGetListMatchEvent(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onResponeGetListPlayer(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_NEW_MATCH_EVENT) {
      this.onResponeAddNewMatchEvent(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_MATCH_EVENT) {
      this.onResponeRemoveMatchEvent(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_MATCH_EVENT) {
      this.onResponeUpdateMatchEvent(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_CLUB_IN_MATCH) {
      this.onResponeUpdateClubInMatch(params);
    } else if (cmd == Bd69SFSCmd.UPDATE_MATCH_RESULT) {
      this.onResponeUpdateMatchResult(params);
    }
  }

  onResponeUpdateMatchResult(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        let home = content.getSFSObject(ParamsKey.HOME);
        let away = content.getSFSObject(ParamsKey.AWAY);
        this.mMatch.getHomeClub().fromSFSObject(home);
        this.mMatch.getAwayClub().fromSFSObject(away);
        this.mAppModule.doLogConsole("match info...", this.mMatch);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateClubInMatch(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        if (content.containsKey(ParamsKey.INFO)) {
          if (clubID == this.mMatch.getHomeID()) {
            this.mMatch.getHomeClub().fromSFSObject(content.getSFSObject(ParamsKey.INFO));
          } else {
            this.mMatch.getAwayClub().fromSFSObject(content.getSFSObject(ParamsKey.INFO));
          }
          this.onLoadPlayerInMatch();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateMatchEvent(params) {

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let eventID = content.getInt(ParamsKey.EVENT_ID);
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getEventID() == eventID;
        })
        if (index > -1) {
          if (content.containsKey(ParamsKey.INFO)) {
            this.mListMatchEvents[index].fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          }
          this.doSortMatchEvents();
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRemoveMatchEvent(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Xoá sự kiện thành công");

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let eventID = content.getInt(ParamsKey.EVENT_ID);
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getEventID() == eventID;
        })

        if (index > -1) {
          this.mListMatchEvents.splice(index, 1);
          this.doSortMatchEvents();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddNewMatchEvent(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          let newEvent = new MatchEvent();
          newEvent.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.mListMatchEvents.push(newEvent);
          this.mAppModule.showToast("Thêm mới sự kiện thành công");
          this.doSortMatchEvents();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onResponeGetListMatchEvent(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListMatchEvents = this.mAppModule.getMatchManager().onResponeSFSArrayMatchEvent(content.getSFSArray(ParamsKey.ARRAY));
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
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params, clubID, leagueID);
          if (clubID == this.mMatch.getHomeID()) {
            this.mListHomePlayers = arrayPlayers;
          } else {
            this.mListAwayPlayers = arrayPlayers;
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeMatchInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mMatch.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          let match = this.mAppModule.getMatchManager().getMatchById(this.mMatch.getMatchID());
          if (match != null) {
            match.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          }
          let home = content.getSFSObject(ParamsKey.HOME);
          let away = content.getSFSObject(ParamsKey.AWAY);
          let stadium = content.getSFSObject(ParamsKey.STADIUM);
          if (stadium) this.mMatch.stadiumName = stadium.getUtfString(ParamsKey.NAME);
          if (home) this.mMatch.getHomeClub().fromSFSObject(home);
          if (away) this.mMatch.getAwayClub().fromSFSObject(away);
          this.mClubIDSelected = this.mMatch.getHomeID();

          if (this.numberDidEnter < 1) {
            this.onLoadPlayers();
            if (this.mMatch.getState() > MatchState.INCOMING) {
              this.onLoadMatchEvent();
            }
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadMatchEvent() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_MATCH_EVENT(this.mMatch.getMatchID(), this.mMatch.getLeagueID());
  }

  onClickEvent(event: MatchEvent) {
    let options = [
      { id: 1, name: "Chỉnh sửa" },
      { id: 2, name: "Xoá" }
    ];

    this.mAppModule.showActionSheet("Sự kiện", options, (id) => {
      if (id) {
        if (id == 1) {
          this.navCtrl.push("MatchEventAddnewPage", { event: event });
        } else {
          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_MATCH_EVENT(event.getEventID(), this.mMatch.getMatchID(), this.mMatch.getLeagueID());
          });
        }
      }
    });
  }

  mListEventItems = [];
  onLoadEventItems() {
    this.mListEventItems = ConstantManager.getInstance().getListMatchEventType();
  }

  onClickAddEvent(event) {

    if (event.id < 6) {
      this.navCtrl.push("MatchEventAddnewPage", { params: { leagueID: this.mMatch.getLeagueID(), matchID: this.mMatch.getMatchID(), type: event.id } });
    }
    else {
      let newEvent = new MatchEvent();
      newEvent.setType(event.id);
      newEvent.setName(ConstantManager.getInstance().getMessageOfEvent(event.id));
      newEvent.setMatchID(this.mMatch.getMatchID());
      newEvent.setLeagueID(this.mMatch.getLeagueID());
      if (event.id == MatchEventType.KICK_OFF) {
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getType() == MatchEventType.KICK_OFF;
        });
        if (index > -1) {
          this.mAppModule.showToast("Trận đấu đang diễn ra");
        } else {
          newEvent.setTime(0);
          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_NEW_MATCH_EVENT(newEvent);
          })
        }
      }
      else if (event.id == MatchEventType.MATCH_OVER) {
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getType() == MatchEventType.MATCH_OVER;
        });
        if (index > -1) {
          this.mAppModule.showToast("Trận đấu đã kết thúc");
        } else {
          newEvent.setTime(92);
          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_NEW_MATCH_EVENT(newEvent);
          })
        }
      }
      else if (event.id == MatchEventType.BREAK_TIME) {
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getType() == MatchEventType.BREAK_TIME;
        });
        if (index > -1) {
          this.mAppModule.showToast("Đang nghỉ giữa trận");
        } else {
          newEvent.setTime(45);
          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_NEW_MATCH_EVENT(newEvent);
          })
        }
      }
      else if (event.id == MatchEventType.SECOND_HALF_START) {
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getType() == MatchEventType.SECOND_HALF_START;
        });
        if (index > -1) {
          this.mAppModule.showToast("Hiệp 2 đã bắt đầu");
        } else {
          newEvent.setTime(46);
          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_NEW_MATCH_EVENT(newEvent);
          })
        }
      }
      else if (event.id == MatchEventType.FIRST_HALF_OFFSET_TIME) {
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getType() == MatchEventType.FIRST_HALF_OFFSET_TIME;
        });
        if (index > -1) {
          this.mAppModule.showToast("Đã thêm thời gian bù giờ");
        } else {
          this.navCtrl.push("MatchEventAddnewPage", { params: { leagueID: this.mMatch.getLeagueID(), matchID: this.mMatch.getMatchID(), type: event.id } });
        }
      }
      else if (event.id == MatchEventType.SECOND_HALF_OFFSET_TIME) {
        let index = this.mListMatchEvents.findIndex(event => {
          return event.getType() == MatchEventType.SECOND_HALF_OFFSET_TIME;
        });
        if (index > -1) {
          this.mAppModule.showToast("Đã thêm thời gian bù giờ");
        } else {
          this.navCtrl.push("MatchEventAddnewPage", { params: { leagueID: this.mMatch.getLeagueID(), matchID: this.mMatch.getMatchID(), type: event.id } });
        }
      }
    }
  }

  doSortMatchEvents() {
    this.mListMatchEvents.sort((a, b) => {
      return b.getTime() - a.getTime();
    });
  }
  onClickAddPlayer() {
    this.navCtrl.push("MatchAddPlayerIntoMatchPage", { params: { leagueID: this.mMatch.getLeagueID(), matchID: this.mMatch.getMatchID(), clubID: this.mClubIDSelected } });
  }

  onClickMore() {
    let options = [
      { id: 1, name: "Tạo biên bản trận đấu" },
      { id: 2, name: "Cập nhật kết quả trận đấu" }
    ];

    this.mAppModule.showActionSheetNoDestruc("Trận đấu", options, (id) => {
      if (id) {
        if (id == 1) {
          this.navCtrl.push("ManagerLeagueRecordMatchPage", { params: { leagueID: this.mMatch.getLeagueID(), matchID: this.mMatch.getMatchID(), mode: "1" } });
        } else {
          this.doUpdateResult();
        }
      }
    });
  }

  doUpdateResult() {
    this.navCtrl.push("MatchUpdateResultPage", { params: { matchID: this.mMatch.getMatchID(), leagueID: this.mMatch.getLeagueID() } });
  }

}
