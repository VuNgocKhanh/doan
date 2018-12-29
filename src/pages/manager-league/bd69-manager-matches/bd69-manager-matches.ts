import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { Match } from '../../../providers/classes/matches';
import { ParamBuilder } from '../../../providers/core/http/param-builder';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Fixtures, FixturesName } from '../../../components/matches-result/matches-result';
import { Group } from '../../../providers/classes/group';
import { Rounds } from '../../../providers/classes/rounds';
import { MatchState } from '../../../providers/manager/constant-manager';
import { Stadium } from '../../../providers/classes/stadium';

/**
 * Generated class for the Bd69ManagerMatchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-manager-matches',
  templateUrl: 'bd69-manager-matches.html',
})
export class Bd69ManagerMatchesPage {
  mListFillter: Array<{ id: number, name: string, disable: boolean }> = [];

  mIDSelected: number = 1;

  mLeagueID: number = -1;

  numberDidEnter: number = 0;

  mMatches: Array<Match> = [];

  page: number = 0;

  nextPage: number = 0;

  mListFixtures: Array<Fixtures> = [];

  mListFixturesName: Array<FixturesName> = [];

  mListGroups: Array<Group> = [];

  mListRounds: Array<Rounds> = [];

  isHaveFixtures: boolean = false;

  mListStadiums: Array<Stadium> = [];

  constructor(
    private mAlertController: AlertController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
    this.onLoadFillterOptions();
  }

  onClickOptionFillter(option, $event) {
    if (option.disable) {
      return;
    }
    this.mIDSelected = option.id;
    let element: HTMLElement = $event.target;
    element.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
    this.onLoadViewFillter();
  }

  onLoadViewFillter() {
    if (this.mIDSelected == 1) {
      this.onParseFixtureseInComing();
    }
    else if (this.mIDSelected == 2) {
      this.onParseFixtureseInFinished();
    }
    else if (this.mIDSelected == 3) {
      this.onParseFixturesByRound();
    }
    else if (this.mIDSelected == 4) {
      this.onParseFixturesByGroup();
    }
  }

  onLoadFillterOptions() {
    this.mListFillter = [
      { id: 1, name: "Chưa diễn ra", disable: false },
      { id: 2, name: "Đã kết thúc", disable: false },
      { id: 3, name: "Vòng đấu", disable: false },
      { id: 4, name: "Bảng đấu", disable: false }
    ];
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_STATIDUM(this.mLeagueID);
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_MATCH(this.mLeagueID, null, -1);
    // this.mAppModule.getLeagueManager().sendRequestGetListStadiumInLeague(this.mLeagueID);
    // this.mAppModule.getLeagueManager().sendRequestGetListMatchOfLeague(this.mLeagueID,null,-1);
  }

  onLoadGroups() {
    // Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_GROUP(this.mLeagueID);
    this.mAppModule.getLeagueManager().sendRequestGetListGroupOfLeague(this.mLeagueID);
  }

  onLoadRounds() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_ROUND(this.mLeagueID);
    // this.mAppModule.getLeagueManager().sendRequestGET_LIST_ROUND_OF_LEAGUE(this.mLeagueID);
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
      Bd69SFSConnector.getInstance().addListener("Bd69ManagerMatchesPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
      this.onLoadGroups();
      this.onLoadRounds();
    })

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69ManagerMatchesPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_STATIDUM) {
      this.onResponeGetListStadiumInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_MATCH) {
      this.onResponeLEAGUE_GET_LIST_MATCH(params);
    }
    else if (cmd == Bd69SFSCmd.GET_LIST_GROUP_OF_LEAGUE) {
      this.onResponeListGroupOfLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_ROUND) {
      this.onResponeGetListRoundOfLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_MATCH) {
      this.onReponeRemoveMatch(params);
    }

  }

  onResponeLEAGUE_GET_LIST_MATCH(params) {
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
          let arrayMatches = this.mAppModule.getMatchManager().onResponeSFSArray(params);
          if (this.page < 1) {
            this.mMatches = arrayMatches;
          } else {
            this.mMatches = this.mMatches.concat(arrayMatches);
          }
          this.mMatches.forEach(match => {
            if (match.stadiumName.trim() == '') {
              match.stadiumName = this.getStadiumNameByID(match.getStadiumID());
            }
          })
          this.onLoadViewFillter();
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  getStadiumNameByID(stadiumID: number): string {
    if (this.mListStadiums.length == 0) return "";
    for (let stadium of this.mListStadiums) {
      return stadium.getName();
    }
    return "";
  }

  onResponeGetListStadiumInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListStadiums = this.mAppModule.getLeagueManager().onParseStadiumList(content.getSFSArray(ParamsKey.ARRAY));
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeListGroupOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListGroups = this.mAppModule.getLeagueManager().onParseGroupList(content.getSFSArray(ParamsKey.ARRAY));
          if (this.mListGroups.length == 0) {
            this.mListFillter[3].disable = true;
          }
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetListRoundOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListRounds = this.mAppModule.getLeagueManager().onParseRoundList(content.getSFSArray(ParamsKey.ARRAY));
          if (this.mListRounds.length == 0) {
            this.mListFillter[2].disable = true;
          }
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }
  onReponeRemoveMatch(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let matchID = content.getInt(ParamsKey.MATCH_ID);
        if (matchID) {
          let index = this.mMatches.findIndex(match => {
            return match.getMatchID() == matchID;
          });
          if (index > -1) {
            this.mMatches.splice(index, 1);
            this.mAppModule.showToast("Đã xoá trận đấu thành công");
            this.onLoadViewFillter();
          }
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.page = 0;
      this.nextPage = 0;

      this.onLoadData();
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onLoadData();
      infiniteScroll.complete();
    }, 500);
  }

  onSelectAddMatch() {
    this.navCtrl.push("CreateMatchesPage", { params: this.mLeagueID });
  }

  onParseFixtureseInComing() {
    this.mListFixtures = [];

    let mArrayDate = this.mAppModule.getMatchManager().onFindDateInArray(this.mMatches);

    let arrayMatches = this.mMatches.filter(match => {
      return match.getState() < MatchState.FINISHED;
    });
    if (arrayMatches.length == 0) {
      this.isHaveFixtures = false;
      return;
    }
    mArrayDate.forEach(element => {
      this.mListFixtures.push({
        date: element,
        matches: this.mAppModule.getMatchManager().getMatchesByDate(element, arrayMatches)
      });
    });

    this.mListFixtures.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    })
    this.mAppModule.doLogConsole("fixtures .. ", this.mListFixtures);
  }

  onParseFixtureseInFinished() {
    this.mListFixtures = [];

    let mArrayDate = this.mAppModule.getMatchManager().onFindDateInArray(this.mMatches);

    let arrayMatches = this.mMatches.filter(match => {
      return match.getState() == MatchState.FINISHED;
    });

    if (arrayMatches.length == 0) {
      this.isHaveFixtures = false;
      return;
    }

    mArrayDate.forEach(element => {
      this.mListFixtures.push({
        date: element,
        matches: this.mAppModule.getMatchManager().getMatchesByDate(element, arrayMatches)
      });
    });

    this.mListFixtures.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    })

    this.mAppModule.doLogConsole("fixtures .. ", this.mListFixtures);

  }

  onParseFixturesByGroup() {
    if (this.mListGroups.length == 0) return;
    this.mListFixturesName = [];

    this.mListGroups.forEach(group => {
      this.mListFixturesName.push({
        name: group.getName(),
        matches: this.onGetMatchByGroupID(group.getGroupID())
      });
    })
  }

  onGetMatchByGroupID(groupID: number): Array<Match> {
    let respone: Array<Match> = [];
    if (this.mMatches.length == 0) return [];
    this.mMatches.forEach(match => {
      if (match.getGroupID() == groupID) {
        respone.push(match);
      }
    })
    return respone;
  }

  onParseFixturesByRound() {
    if (this.mListRounds.length == 0) return;
    this.mListFixturesName = [];
    this.mListRounds.forEach(round => {
      this.mListFixturesName.push({
        name: round.getName(),
        matches: this.onGetMatchByRoundID(round.getRoundiD())
      });
    })
  }

  onGetMatchByRoundID(roundID: number): Array<Match> {
    let respone: Array<Match> = [];
    if (this.mMatches.length == 0) return [];
    this.mMatches.forEach(match => {
      if (match.getRoundID() == roundID) {
        respone.push(match);
      }
    })
    return respone;
  }


  onClickMatch($event) {
    let match: Match = $event.match;
    let id = $event.id;

    if (id == 0) {
      this.goToViewMatch(match);
    } else if (id == 1) {
      this.doUpdateMatch(match);
    } else if (id == 2) {
      this.doUpdateResult(match);
    } else if (id == 3) {
      this.doUpdateEvent(match);
    } else if (id == 4) {
      this.doCreateMatchRecord(match);
    } else if (id == 5) {
      this.doRemoveMatch(match);
    }


  }

  doCreateMatchRecord(match: Match) {
    this.navCtrl.push("ManagerLeagueRecordMatchPage", { params: { leagueID: this.mLeagueID, matchID: match.getMatchID(), mode: "1" } });
  }

  goToViewMatch(match: Match) {
    this.navCtrl.push("MatchInfoPage", { params: { matchID: match.getMatchID(), leagueID: this.mLeagueID } });
  }

  doUpdateMatch(match) {
    this.navCtrl.push("CreateMatchesPage", { match: match });
  }

  doUpdateResult(match) {
    if (match.getState() < MatchState.PLAYING) {
      this.mAppModule.showToast("Trận đấu chưa diễn ra không thể cập nhật");
      return;
    }
    this.navCtrl.push("MatchUpdateResultPage", { params: { matchID: match.getMatchID(), leagueID: this.mLeagueID } });
  }

  doUpdateEvent(match: Match) {
    this.navCtrl.push("Bd69ManagerMatchesUpdateMatchEventPage", { params: { leagueID: this.mLeagueID, matchID: match.getMatchID() } });
  }

  doRemoveMatch(match: Match) {
    if (match.getState() == MatchState.INCOMING || match.getState() == MatchState.CANCEL) {
      let alert = this.mAlertController.create();
      alert.setTitle("Thông báo");
      alert.setMessage("Bạn muốn xóa trận đấu giữa " + match.getHomeClub().getName() + " - " + match.getAwayClub().getName());
      alert.addButton({
        text: "Không"
      });
      alert.addButton({
        text: "Xóa",
        handler: () => {
          // this.mAppModule.showLoading().then(() => {
          //   this.mAppModule.getMatchManager().sendRequestDeleteMatch(match.getMatchID(), match.getLeagueID());
          // });

          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_MATCH(match.getLeagueID(), match.getMatchID());
          });


        }
      });
      alert.present();

    } else {
      this.mAppModule.showToast("Trận đấu đã diễn ra không thể xoá");
    }
  }
}
