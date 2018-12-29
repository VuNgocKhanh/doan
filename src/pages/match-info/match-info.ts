import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Match } from '../../providers/classes/matches';
import { Stadium } from '../../providers/classes/stadium';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ParamBuilder } from '../../providers/core/http/param-builder';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { MatchEvent } from '../../providers/classes/mathchevent';
import { MatchState, ConstantManager, RoleInLeague, MatchEventType, RoleInClub } from '../../providers/manager/constant-manager';
import { Player } from '../../providers/classes/player';

/**
 * Generated class for the MatchInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match-info',
  templateUrl: 'match-info.html',
})
export class MatchInfoPage {

  mMatch: Match = new Match();

  mStadium: Stadium = new Stadium();

  mMatchEvents: Array<MatchEvent> = [];

  mTabs: Array<{ id: number, icon: string, name: string }> = [
    { id: 0, icon: "ios-mic-outline", name: "Live" },
    { id: 1, icon: "ios-shirt-outline", name: "Đội" },
    { id: 2, icon: "ios-stats-outline", name: "Thống kê" }
  ];

  mTabIDSelected: number = 0;

  isRoleEdit: boolean = true;

  items: Array<{ id: number, icon: string, name: string, disabled?: boolean }> = [];

  mListFromStart: Array<Player> = [];

  mListFromOther: Array<Player> = [];

  mListPlayerHomeClub: Array<Player> = [];

  mListPlayerAwayClub: Array<Player> = [];

  mEventSelected: any;

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onClickItem(item) {

    this.mAppModule.showModal("MatchEventAddnewPage", { params: { leagueID: this.mMatch.getLeagueID(), matchID: this.mMatch.getMatchID(), eventType: item.id >= 0 ? item.id : null } }, (newEvent) => {
      if (newEvent) {
        this.mMatchEvents.push(newEvent);
        this.doSortMatchEvents();
      }
    });
  }


  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      let matchID = params["matchID"];
      let leagueID = params["leagueID"];

      if (matchID > -1) {
        this.mMatch.setMatchID(matchID);
        this.mMatch.fromObject(this.mAppModule.getMatchManager().getMatchById(matchID));
      } else {
        this.mAppModule.showToast("Invalid Match ID");
      }

      if (leagueID > -1) {
        this.mMatch.setLeagueID(leagueID);
      } else {
        this.mAppModule.showToast("Invalid League ID");
      }
    }
  }

  ionViewDidLoad() {

    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("MatchInfoPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.mAppModule.getMatchManager().sendRequestGetMatchInfo(this.mMatch.getMatchID(), this.mMatch.getLeagueID());
    });
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("MatchInfoPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_MATCH_INFO) {
      this.onResponeGetMatchInfo(params);
    } else if (cmd == Bd69SFSCmd.GET_STADIUM_INFO) {
      this.onResponeGetStadiumInfo(params);
    } else if (cmd == Bd69SFSCmd.GET_USER_IN_LEAGUE) {
      this.onResponeGetPlayerInClub(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_MATCH_EVENT) {
      this.onResponeGetListMatchEvent(params);
    } else if (cmd == Bd69SFSCmd.REMOVE_MATCH_EVENT) {
      this.onResponeRemoveMatchEvent(params);
    } else if (cmd == Bd69SFSCmd.ADD_MATCH_EVENT) {
      this.onResponeAddMatchEvent(params);
    }
    // else if (cmd == Bd69SFSCmd.ADD_MATCH_KICK_OFF){
    //   this.onResponeAddMatchKickOff(params);
    // }
  }

  onResponeAddMatchEvent(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          let newMatchEvent = new MatchEvent();
          newMatchEvent.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.mMatchEvents.push(newMatchEvent);
          this.doSortMatchEvents();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddMatchKickOff(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRemoveMatchEvent(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let eventID = content.getInt(ParamsKey.EVENT_ID);
        let index = this.mMatchEvents.findIndex(event => {
          return event.getEventID() == eventID;
        });

        if (index > -1) {
          this.mMatchEvents.splice(index, 1);
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
          this.mMatchEvents = this.mAppModule.getMatchManager().onResponeSFSArrayMatchEvent(content.getSFSArray(ParamsKey.ARRAY));
          this.doSortMatchEvents();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetStadiumInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mStadium.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onResponeGetMatchInfo(params) {
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
          this.mMatch.getHomeClub().fromSFSObject(home);
          this.mMatch.getAwayClub().fromSFSObject(away);
          this.onLoadStadiumInfo();
          this.onLoadPlayerInClub();

          if (this.mMatch.getState() > MatchState.INCOMING) {
            this.onLoadMatchEventList();
          }
        }
        if (content.containsKey(ParamsKey.MANAGE_PERMISSON)) {
          this.isRoleEdit = content.getBool(ParamsKey.MANAGE_PERMISSON);
          if (this.isRoleEdit) {
            this.isShowBtnUpdatePlayer = true;
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetPlayerInClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        let clubId = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {

          let arrayPlayer = this.mAppModule.getPlayerManager().onParsePlayer(params,clubId,leagueID);
          let clubID = arrayPlayer[0].getClubID();

          if (clubID == this.mMatch.getHomeClub().getClubID()) {
            this.mListPlayerHomeClub = arrayPlayer;
          } else {
            this.mListPlayerAwayClub = arrayPlayer;
          }
          this.onLoadPlayerFromStart(this.mClubSelectedIndex);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadMatchEventList() {
    this.mAppModule.getMatchManager().sendRequestGetListMatchEvent(this.mMatch.getMatchID(), this.mMatch.getLeagueID());
  }


  onLoadStadiumInfo() {
    if (this.mMatch.getStadiumID() > -1) {
      this.mAppModule.getLeagueManager().sendRequestGetStadiumInfo(this.mMatch.getStadiumID());
    } else {
      this.mAppModule.showToast("Chưa cập nhật sân vận động");
    }
  }

  onLoadPlayerInClub() {
    this.mAppModule.getLeagueManager().sendRequestGetPlayerInLeague(this.mMatch.getLeagueID(), this.mMatch.getHomeID(), -1);
    this.mAppModule.getLeagueManager().sendRequestGetPlayerInLeague(this.mMatch.getLeagueID(), this.mMatch.getAwayID(), -1);
  }

  onClickTab(tab) {
    this.mTabIDSelected = tab.id;
  }



  doSortMatchEvents() {
    this.mMatchEvents.sort((a, b) => {
      return b.getTime() - a.getTime();
    });
  }

  onClickStartMatch() {
    let newMatchEvent = new MatchEvent();
    newMatchEvent.setLeagueID(this.mMatch.getLeagueID());
    newMatchEvent.setMatchID(this.mMatch.getMatchID());
    newMatchEvent.setType(MatchEventType.KICK_OFF);
    newMatchEvent.setTime(0);
    newMatchEvent.setName("Trận đấu bắt đầu");
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getMatchManager().sendRequestAddMatchEvent(newMatchEvent);
    });
  }

  // getEventIcon(type): string {
  //   // return ConstantManager.getInstance().getListMatchEventType()[type].icon;
  // }

  mClubSelectedIndex: number = 1;
  isShowBtnUpdatePlayer: boolean = false;

  onClickClub(number) {
    this.mClubSelectedIndex = number;
    this.onLoadPlayerFromStart(number);
    let clubID: number = -1;
    if (this.mClubSelectedIndex == 1) {
      clubID = this.mMatch.getHomeID();
    } else {
      clubID = this.mMatch.getAwayID();
    }

    if (this.isRoleEdit) {
      if (this.mAppModule.getUserManager().getUser().getRole() > 0) {
        this.isShowBtnUpdatePlayer = true;
      } else {
        let roleOfUser = this.mAppModule.getClubManager().checkClubUserTakePartIn(clubID);
        if (roleOfUser >= RoleInClub.CAPTAIN) {
          this.isShowBtnUpdatePlayer = true;
        } else {
          this.isShowBtnUpdatePlayer = false;
        }
      }
    } else {
      this.isShowBtnUpdatePlayer = false;
    }
  }

  onLoadPlayerFromStart(number: number) {
    let arrayPlayer: Array<Player> = [];
    let arrayPlayerIDs = [];
    this.mListFromStart = [];
    this.mListFromOther = [];
    if (number == 1) {
      arrayPlayer = this.mListPlayerHomeClub;
      arrayPlayerIDs = this.mMatch.getHomeClub().getPlayersInMatch();
    } else {
      arrayPlayer = this.mListPlayerAwayClub;
      arrayPlayerIDs = this.mMatch.getAwayClub().getPlayersInMatch();
    }

    if (arrayPlayerIDs.length == 0) return;

    arrayPlayer.forEach(player => {
      let check = false;
      for (let i = 0; i < arrayPlayerIDs.length; i++) {
        if (player.getPlayerID() == arrayPlayerIDs[i]) {
          this.mListFromStart.push(player);
          check = true;
          break;
        }
      }

      if (!check) {
        this.mListFromOther.push(player);
      }
    });

  }

  onClickUpdatePlayer() {

    let clubID: number = -1;
    if (this.mClubSelectedIndex == 1) {
      clubID = this.mMatch.getHomeID();
    } else {
      clubID = this.mMatch.getAwayID();
    }

    let club = this.mAppModule.getUserManager().getClubManagerInLeagueByID(clubID);

    if(club){
      this.mAppModule.showModal("MatchAddPlayerIntoMatchPage", { params: { leagueID: this.mMatch.getLeagueID(), matchID: this.mMatch.getMatchID(), clubID: clubID } }, (players) => {
        if (players) {
          if (this.mClubSelectedIndex == 1) {
            this.mMatch.getHomeClub().setPlayers(players);
          } else {
            this.mMatch.getAwayClub().setPlayers(players);
          }
  
          this.onLoadPlayerFromStart(this.mClubSelectedIndex);
        }
      });
    }else{
      this.mAppModule.showToast("Bạn không là lãnh đội của câu lạc bộ này");
    }
   
  }


} 
