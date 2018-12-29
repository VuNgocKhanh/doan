import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Match } from '../../providers/classes/matches';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { MatchEvent } from '../../providers/classes/mathchevent';
import { RefereeInMatch } from '../../providers/classes/referee';
import { Leagues } from '../../providers/classes/league';
import { ConstantManager } from '../../providers/manager/constant-manager';
import { ClubInMatch } from '../../providers/classes/clubinmatch';

/**
 * Generated class for the ManagerLeagueRecordMatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-league-record-match',
  templateUrl: 'manager-league-record-match.html',
})
export class ManagerLeagueRecordMatchPage {
  /**Mode = 1 (Ban to chuc) , Mode = 2 (Lanh doi cau lac bo trong giai dau) */
  mode: number = 1;

  title = "Biên bản trận đấu";

  mListInfo: Array<{ name: string, value: string }> = [];

  mListResultMatch: Array<{ name: string, value: string }> = [];

  mListReferee: Array<RefereeInMatch> = [];

  mMatch: Match = new Match();

  mListMatchEvents: Array<MatchEvent> = [];

  mListHomeEvents: Array<MatchEvent> = [];

  mListAwayEvents: Array<MatchEvent> = [];

  mLeague: Leagues = new Leagues();

  isLoadInfo: boolean = true;

  isLoadEvent: boolean = true;

  mClubID: number = -1;

  mUserClub: ClubInMatch = new ClubInMatch();

  mAwayClub: ClubInMatch = new ClubInMatch();

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }
  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mMatch.setLeagueID(params["leagueID"]);
      this.mMatch.setMatchID(params["matchID"]);
      if (params["mode"]) this.mode = params["mode"];

      if (params["clubID"]) {
        this.mClubID = params["clubID"];
      } else {
        this.onLoadClubID();
      }
    }
  }
  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_MATCH_INFO(this.mMatch.getLeagueID(), this.mMatch.getMatchID());
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_MATCH_EVENT(this.mMatch.getMatchID(), this.mMatch.getLeagueID());
  }

  ionViewDidLoad() {

    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("ManagerLeagueRecordMatchPage", respone => {
        this.onExtensionRespone(respone);
      })
      this.onLoadData();
    })

  }


  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("ManagerLeagueRecordMatchPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_MATCH_INFO) {
      this.onResponeMatchInfo(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_MATCH_EVENT) {
      this.onResponeGetListMatchEvent(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_SUBMIT_MATCH_RECORD) {
      this.onResponeSubmitMatchRecord(params);
    }
  }

  onResponeMatchInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mMatch.fromSFSobject(content.getSFSObject(ParamsKey.INFO));

        }
        if (content.containsKey(ParamsKey.HOME)) {
          this.mMatch.getHomeClub().fromSFSObject(content.getSFSObject(ParamsKey.HOME));
        }

        if (content.containsKey(ParamsKey.AWAY)) {
          this.mMatch.getAwayClub().fromSFSObject(content.getSFSObject(ParamsKey.AWAY));
        }

        if (content.containsKey(ParamsKey.STADIUM)) {
          this.mMatch.getStadium().fromSFSobject(content.getSFSObject(ParamsKey.STADIUM));
        }

        if (content.containsKey(ParamsKey.REFEREES)) {
          this.mMatch.onResponeReferee(content.getSFSArray(ParamsKey.REFEREES));
          this.mListReferee = this.mMatch.getListRefereeInMatch();
          this.mListReferee.sort((a, b) => {
            return a.getRefereeRole() - b.getRefereeRole();
          })
        }


        if (content.containsKey(ParamsKey.LEAGUE)) {
          this.mLeague.fromSFSobject(content.getSFSObject(ParamsKey.LEAGUE));
        }

        if (this.mClubID > -1) {
          if (this.mClubID == this.mMatch.getHomeID()) {
            this.mUserClub = this.mMatch.getHomeClub();
            this.mAwayClub = this.mMatch.getAwayClub();
          } else {
            this.mUserClub = this.mMatch.getAwayClub();
            this.mAwayClub = this.mMatch.getHomeClub();
          }
        }

        this.onLoadMatchInfo();
        this.onLoadResult();
        this.onLoadClubEvent();
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
          this.onLoadClubEvent();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeSubmitMatchRecord(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.mAppModule.showToast("Bạn đã submit biên bản trận đấu thành công");
        this.navCtrl.pop();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadMatchInfo() {
    this.mListInfo = [
      { name: "Tên giải đấu ", value: this.mLeague.getName() },
      { name: "Đội 1  ", value: this.mMatch.getHomeClub().getName() },
      { name: "Đội 2 ", value: this.mMatch.getAwayClub().getName() },
      { name: "Thời gian ", value: this.mMatch.getTimeString() },
      { name: "Địa điểm ", value: this.mMatch.getStadium().getName() }
    ];
  }

  onLoadResult() {
    this.mListResultMatch = [
      { name: "Tỷ số", value: this.mMatch.getHomeClub().getGoal() + " - " + this.mMatch.getAwayClub().getGoal() },
    ];

    if (this.mMatch.getHomeClub().getGoal() == this.mMatch.getAwayClub().getGoal()) {
      this.mListResultMatch.push(
        { name: "Kết quả", value: "Hoà" }
      );
    } else {
      this.mListResultMatch.push(
        { name: "Đội thắng", value: this.mMatch.getHomeClub().getGoal() > this.mMatch.getAwayClub().getGoal() ? this.mMatch.getHomeClub().getName() : this.mMatch.getAwayClub().getName() }
      );
      this.mListResultMatch.push(
        { name: "Đội thua", value: this.mMatch.getHomeClub().getGoal() < this.mMatch.getAwayClub().getGoal() ? this.mMatch.getHomeClub().getName() : this.mMatch.getAwayClub().getName() }
      );
    }
  }

  onLoadClubEvent() {
    if (this.mListMatchEvents.length == 0) return;
    this.mListMatchEvents.forEach(event => {
      if (event.getType() < 4) {
        if (event.getClubID() == this.mMatch.getHomeID()) {
          this.mListHomeEvents.push(event);
        } else if (event.getClubID() == this.mMatch.getAwayID()) {
          this.mListAwayEvents.push(event);
        }
      }
    });

    this.mListHomeEvents.sort((a, b) => {
      return a.getType() - b.getType();
    });
    this.mListAwayEvents.sort((a, b) => {
      return a.getType() - b.getType();
    });

    this.mAppModule.doLogConsole("match events ..", this.mListHomeEvents);
  }

  onLoadClubID() {
    let mListClubManagerInLeague = this.mAppModule.getUserManager().getListManagerClubInLeague();

    let leagueID = this.navParams.get("params")["leagueID"];
   
    let index = mListClubManagerInLeague.findIndex(club => {
      return club.getLeague().getLeagueID() == leagueID
    });
    if (index > -1) {
      this.mClubID = mListClubManagerInLeague[index].getClub().getClubID();
    }
  }

  getNameOfEvent(type: number): string {
    return ConstantManager.getInstance().getListMatchEventType()[type].name;
  }

  onClickAccept() {
    this.mAppModule.showLoading().then(() => {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_SUBMIT_MATCH_RECORD(this.mClubID, this.mMatch.getMatchID(), this.mLeague.getLeagueID(), 1);
    });
  }

}
