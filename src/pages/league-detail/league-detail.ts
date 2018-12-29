import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../providers/classes/league';
import { Stadium } from '../../providers/classes/stadium';
import { Dornor, DornorInLeague } from '../../providers/classes/donnor';
import { RoleInLeague, SEARCH_TYPE, RoleInClub, StateClubInLeague, MatchState } from '../../providers/manager/constant-manager';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Fixtures } from '../../components/matches-result/matches-result';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Clubs } from '../../providers/classes/clubs';
import { ClubInLeague } from '../../providers/classes/clubinleague';
import { isGeneratedFile } from '../../../node_modules/@angular/compiler/src/aot/util';
import { JoinLeagueRequest } from '../../providers/classes/joinleaguerequest';
import { Group } from '../../providers/classes/group';
import { Match } from '../../providers/classes/matches';
import { TopGoalInLeague } from '../../providers/classes/top-goal-in-league';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { TopCardInLeague } from '../../providers/classes/top-card-in-league';
import { ParseModule } from '../../providers/app-module/parse-module';

@IonicPage()
@Component({
  selector: 'page-league-detail',
  templateUrl: 'league-detail.html',
})
export class LeagueDetailPage {

  mListClubs: Array<ClubInLeague> = [];

  mGoalList: Array<TopGoalInLeague> = [];

  mCardList: Array<TopCardInLeague> = [];

  mMatches: Array<Match> = [];

  mListFixturesShort: Array<Fixtures> = [];

  mTablesShort: Array<ClubInLeague> = [];
  mTablesGroup: Array<ClubInLeague> = [];

  mGroups: Array<Group> = [];

  mRoleOfUserInLeague: number = RoleInLeague.GUEST;

  mClubInLeague: ClubInLeague = new ClubInLeague();

  menuSelectedID: number = 0;

  mLeague: Leagues = new Leagues();

  groupSelected: number = -1;

  mStadium: Stadium = new Stadium();
  mDonors: Array<DornorInLeague> = [];
  mDornorsDiamond: Array<DornorInLeague> = [];
  mDornorsOther: Array<DornorInLeague> = [];
  mArrayFillter: Array<Fixtures> = [];

  today: Date = new Date();

  mStateClub: string = "Xem câu lạc bộ của bạn";

  menus: Array<{ id: number, name: string, icon?: string, page: string, color?: string }> = [];

  listClub: Array<Clubs> = [];
  requestSending: boolean = false;

  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LEAGUE_INFO(this.mLeague.getLeagueID());
    this.mAppModule.getLeagueManager().sendRequestGetListStadiumInLeague(this.mLeague.getLeagueID());
    this.onLoadDornor();
    this.mAppModule.getUserManager().sendRequestGetTopGoalInLeague(this.mLeague.getLeagueID(), 0);
    this.mAppModule.getUserManager().sendRequestGetTopCardInLeague(this.mLeague.getLeagueID(), 0);
    this.mAppModule.getLeagueManager().sendRequestGetListMatchOfLeague(this.mLeague.getLeagueID(), null, -1);
    this.mAppModule.getLeagueManager().sendRequestGetTableOfLeague(this.mLeague.getLeagueID());
    this.mAppModule.getLeagueManager().getClubInLeague(this.mLeague.getLeagueID());
    this.mAppModule.getLeagueManager().sendRequestGetListGroupOfLeague(this.mLeague.getLeagueID());
  }


  numberDidEnter: number = 0;
  ionViewWillEnter() {
    if (this.numberDidEnter > 0) {
      this.mAppModule.getUserManager().sendRequestGetLeagueInfo(this.mLeague.getLeagueID());
      this.onLoadData();
    }

  }
  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule.addBd69SFSResponeListener("LeagueDetailPage", respone => {
      this.onExtendsionRespone(respone);
    });

    this.onLoadData();
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;


    if (cmd == Bd69SFSCmd.LEAGUE_GET_LEAGUE_INFO) {
      this.onResponeGetLeagueInfo(params);
    }
    else if (cmd == Bd69SFSCmd.GET_LIST_MATCH_OF_LEAGUE) {
      this.onResponeGetListMatchOfLeague(params);
    }
    else if (cmd == Bd69SFSCmd.GET_TABLE_OF_LEAGUE) {
      this.onResponeGetTableOfLeague(params);
    }
    else if (cmd == Bd69SFSCmd.GET_LIST_GROUP_OF_LEAGUE) {
      this.onResponeGetListGroupOfLeague(params);
    }
    else if (cmd == Bd69SFSCmd.GET_LIST_DORNOR_IN_LEAGUE) {
      this.onResponeGetListDornorInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.UPDATE_LEAGUE_INFO) {
      this.onResponeUpdateLeagueInfo(params);
    }
    else if (cmd == Bd69SFSCmd.GET_CLUB_IN_LEAGUE_INFO) {
      this.onResponeGetClubInLeagueInfo(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_STADIUM_IN_LEAGUE) {
      this.onResponeGetListStadiumInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.GET_TOP_GOAL_OF_LEAGUE) {
      this.onResponseGetGoalArray(params);
    }
    else if (cmd == Bd69SFSCmd.GET_TOP_CARD_OF_LEAGUE) {
      this.onResponseGetCardArray(params);
    }
    else if (cmd == Bd69SFSCmd.GET_CLUB_IN_LEAGUE) {
      this.onParseClubInLeague(params);
    }
  }


  onParseClubInLeague(params) {
    let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
    if (sfsArray) {
      this.mListClubs = [];
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsdata = sfsArray.getSFSObject(i);
        let newRequest = new ClubInLeague();
        newRequest.onFromSFSobject(sfsdata);
        newRequest.setLeagueID(this.mLeague.getLeagueID());
        this.mListClubs.push(newRequest);
      }
      this.mListClubs.sort((a, b) => {
        return a.getState() - b.getState();
      })
    }
  }

  onResponseGetGoalArray(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mGoalList = this.mAppModule.getLeagueManager().onParseGoalListShort(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    }
  }

  onResponseGetCardArray(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mCardList = this.mAppModule.getLeagueManager().onParseCardListShort(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    }
  }

  onResponeGetListMatchOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.onGetMatchesSuceess(params);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadStadiumName() {
    if (this.mMatches.length > 0) {
      this.mMatches.forEach(match => {
        let stadium = this.mAppModule.getLeagueManager().getStadiumByID(match.getStadiumID());
        if (stadium) {
          match.stadiumName = stadium.getName();
        }
      })
    }
  }

  onGetMatchesSuceess(params) {
    let content = params.getSFSObject(ParamsKey.CONTENT);
    if (content && content.containsKey(ParamsKey.ARRAY)) {
      this.mMatches = this.mAppModule.getMatchManager().onResponeSFSShortArray(params);
      this.onLoadStadiumName();
      this.onLoadArray();
    }
  }

  onLoadArray() {

    if (this.mMatches.length == 0) return;

    let mArrayDate = this.mAppModule.getMatchManager().onFindDateInArray(this.mMatches);

    mArrayDate.sort((a, b) => {
      return a.getTime() - b.getTime();
    })


    this.mListFixturesShort = [];

    this.mListFixturesShort.push({
      date: mArrayDate[0],
      matches: this.mAppModule.getMatchManager().getMatchesByDate(mArrayDate[0], this.mMatches)
    });

  }

  onResponeGetListGroupOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mGroups = this.mAppModule.getLeagueManager().onParseGroupList(content.getSFSArray(ParamsKey.ARRAY));
          if (this.mGroups.length > 0) {
            this.groupSelected = this.mGroups[0].getGroupID();
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetTableOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          if (this.mGroups.length <= 1) {
            this.mTablesShort = this.mAppModule.getLeagueManager().onParseClubInLeagueShortSFSArray(content.getSFSArray(ParamsKey.ARRAY));
            this.mTablesShort.sort((a, b) => {
              return b.getPoints() - a.getPoints();
            });
          } else {
            this.mTablesShort = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
            for (let i = 0; i < this.mGroups.length; i++) {
              let group: Array<ClubInLeague> = [];
              for (let j = 0; j < this.mTablesShort.length; j++) {
                if (this.mTablesShort[j].getGroupID() == this.mGroups[i].getGroupID()) {
                  group.push(this.mTablesShort[j]);
                }
              }
              this.mGroups[i].setListClub(group);

            }
            this.mTablesGroup = this.mGroups[0].getListClub();
            this.mTablesGroup.sort((a, b) => {
              return b.getPoints() - a.getPoints();
            });
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetLeagueInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.mRoleOfUserInLeague = content.getInt(ParamsKey.ROLE_IN_LEAGUE);
        this.mLeague.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        this.mLeague.setRoleOfUserInLeague(this.mRoleOfUserInLeague);
        if (this.mRoleOfUserInLeague > RoleInLeague.GUEST) {
          let league = this.mAppModule.getLeagueManager().getLeagueByID(this.mLeague.getLeagueID());
          if (league) {
            let clubID = league.getClubID();
            if (clubID > -1) this.mAppModule.getLeagueManager().sendRequestGetClubInLeagueInfo(clubID, this.mLeague.getLeagueID());
          }
        }
        if (content.containsKey("request_join_leagues")) {
          let sfsArray = content.getSFSArray("request_join_leagues");
          if (sfsArray.size() > 0) {
            this.requestSending = true;
          }
        }
        let league = this.mAppModule.getLeagueManager().getLeagueByID(this.mLeague.getLeagueID());
        if (league) {
          league.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        } else {
          this.mAppModule.getLeagueManager().addLeague(this.mLeague);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetListDornorInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.onResponeSFSDonorArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateLeagueInfo(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mLeague.fromSFSobject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetClubInLeagueInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mClubInLeague.onFromSFSobject(content.getSFSObject(ParamsKey.INFO));
          if (this.mClubInLeague.getState() > StateClubInLeague.JOINNED && this.mClubInLeague.getState() < StateClubInLeague.BLOCKED) {
            this.mStateClub = "Cập nhật hồ sơ câu lạc bộ";
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeSFSDonorArray(sfsArray) {
    if (!sfsArray) return;
    let mDonors: Array<DornorInLeague> = [];
    mDonors = this.mAppModule.getUserManager().onResponeDornorInLeagueSFSArray(sfsArray);

    let mDornorsDiamond: Array<DornorInLeague> = [];
    let mDornorsOther: Array<DornorInLeague> = [];
    mDonors.forEach(dor => {
      if (dor.getPriority() == 1) {
        mDornorsDiamond.push(dor);
        this.mDornorsDiamond = mDornorsDiamond;
      } else {
        mDornorsOther.push(dor);
        this.mDornorsOther = mDornorsOther
      }
    });


  }

  onResponeGetListStadiumInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          let array = this.mAppModule.getLeagueManager().onParseStadiumList(content.getSFSArray(ParamsKey.ARRAY));
          this.onLoadStadiumName();

          if (array.length > 0) {
            this.mStadium = array[0];
            array.forEach(stadium => {
              let newstadium = this.mAppModule.getLeagueManager().getStadiumByID(stadium.getStadiumID());
              if (!newstadium) {
                this.mAppModule.getLeagueManager().addStadium(stadium);
              } else {
                newstadium = stadium;
              }
            })
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("LeagueDetailPage");
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague.setLeagueID(this.navParams.get("params"));
      this.mRoleOfUserInLeague = this.mAppModule.getLeagueManager().checkLeaguebUserTakePartIn(this.mLeague.getLeagueID());
    }
  }

  onLoadDornor() {
    this.mAppModule.getLeagueManager().sendRequestGetListDonorInLeague(this.mLeague.getLeagueID());
  }


  getClickRight() {

  }

  selectMenu(item) {
    this.menuSelectedID = item.id;
  }

  goToPage(item) {
    if (item.page) {
      this.navCtrl.push(item.page, { params: this.mLeague.getLeagueID() });
    }
  }

  goToSearchPage() {
    this.navCtrl.push("Bd69SearchPage", { params: SEARCH_TYPE.LEAGUE });
  }

  goToAdminTool() {
    this.navCtrl.push("LeagueManagerPage", { params: this.mLeague.getLeagueID() });
  }

  goToResult() {
    this.navCtrl.push("Bd69FixturesPage", { params: this.mLeague.getLeagueID() });
  }

  goToTable() {
    this.navCtrl.push("Bd69TablesPage", { params: this.mLeague.getLeagueID() });
  }

  goToTopGoal() {
    this.numberDidEnter = 1;
    this.navCtrl.push("TopGoalInLeaguePage", { params: this.mLeague.getLeagueID() });
  }

  goToTopCard() {
    this.numberDidEnter = 1;
    this.navCtrl.push("TopCardInLeaguePage", { params: this.mLeague.getLeagueID() });
  }

  onClickInfo() {
    // this.navCtrl.push("Bd69ProfileLeaguePage", { params: this.mLeague });
  }

  onClickCameraCover() {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mLeague.getCover(), type: 2 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestUpdateLeagueCover(this.mLeague.getLeagueID(), url);
        });
      }
    })
  }

  onClickPlayerInfo(event: any) {
    this.navCtrl.push("PlayerInfoPage", { params: { playerID: event.getPlayerID(), clubID: event.getClubID(), leagueID: event.getLeagueID() } });
  }


  onClickMatch(params: { match: Match, id: number }) {
    let match = params.match;
    let id = params.id;

    if (id == 0) {
      this.navCtrl.push("MatchInfoPage", { params: { leagueID: match.getLeagueID(), matchID: match.getMatchID() } });
    }
    else if (id == 1) {
      this.mAppModule.showModalIonic("CreateMatchesPage", { match: match }, (newMatch) => {
        if (newMatch) {
          match.fromObject(newMatch);
          this.onLoadArray();
        }
      });
    }
    else if (id == 2) {
      if (match.getState() < MatchState.PLAYING) {
        this.mAppModule.showToast("Trận đấu chưa diễn ra không thể cập nhật");
        return;
      }
      this.mAppModule.showModalIonic("MatchUpdateResultPage", { params: { matchID: match.getMatchID(), leagueID: match.getLeagueID() } }, (newMatch) => {
        if (newMatch) {
          match.fromObject(newMatch);
          this.onLoadArray();
        }
      });
    }
    else if (id == 3) {
      this.mAppModule.showAlert("Xoá trận đấu", (option) => {
        if (option == 1) {
          if (match.getState() == MatchState.INCOMING || match.getState() == MatchState.CANCEL) {
            this.mAppModule.showLoading().then(() => {
              this.mAppModule.getMatchManager().sendRequestDeleteMatch(match.getMatchID(), match.getLeagueID());
            });
          } else {
            this.mAppModule.showToast("Trận đấu đã diễn ra không thể xoá");
          }
        }
      })
    }
  }


  goToListPlayer(item: ClubInLeague) {
    this.navCtrl.push("ListPlayerPage", { params: { leagueID: item.getLeagueID(), clubID: item.getClubID() } });
  }

  goToProfileClub(item: ClubInLeague, type: number) {
    this.navCtrl.push("ListPlayerPage", { params: { leagueID: item.getLeagueID(), clubID: item.getClubID() } });
  }

  onClickShowStadiumDetail() {
    this.navCtrl.push("StadiumDetailPage", { stadiumID: this.mStadium.getStadiumID() });
  }

  onClickShowMap() {
    let a = document.createElement("a");
    a.href = "https://www.google.com/maps/search/" + this.mStadium.getName();
    document.body.appendChild(a);
    a.click();
  }

  onClickGroup(group: Group, event, index) {
    this.mTablesGroup = this.mGroups[index].getListClub();
    this.mTablesGroup.sort((a, b) => {
      return b.getPoints() - a.getPoints();
    });

    this.groupSelected = group.getGroupID();
    let element: HTMLElement = event.target;
    element.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });

  }


  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }

}
