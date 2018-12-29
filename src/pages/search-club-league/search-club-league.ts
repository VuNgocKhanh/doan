import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clubs } from '../../providers/classes/clubs';
import { Leagues } from '../../providers/classes/league';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { SEARCH_TYPE, RoleOfUserInSystem } from '../../providers/manager/constant-manager';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { ManagerClubInLeagues } from '../../providers/manager/user-manager';

/**
 * Generated class for the SearchClubLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-club-league',
  templateUrl: 'search-club-league.html',
})
export class SearchClubLeaguePage {

  title: string = "Câu lạc bộ của bạn";

  mode: string = "club";

  isDidEnter: number = 0;

  mListClubJoin: Array<Clubs> = [];

  mListClubManager: Array<Clubs> = [];

  mListClubManagerInLeague: Array<ManagerClubInLeagues> = [];

  mListActionSheet: Array<{ id: number, name: string }> = [];

  mListLeagueEditor: Array<Leagues> = [];

  mListLeagueMember: Array<Leagues> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mode = this.navParams.get("params");
      if (this.mode == "league") {
        this.title = "Giải đấu của bạn";
      }
    }
  }

  onResfreshData() {
    this.mAppModule.getLeagueManager().sendRequestGetLeagueOfUser();
    this.mAppModule.getClubManager().sendRequestGetClubOfUser();
    this.mAppModule.getClubManager().sendRequestGetListClubOfManager();
  }

  onLoadData() {
    this.mAppModule.getClubManager().sendRequestGetClubOfUser();
    this.mAppModule.getClubManager().sendRequestGetListClubOfManager();

    this.mListLeagueEditor = this.mAppModule.getUserManager().getListManagerLeagueInLeague();
    this.mListLeagueMember = this.mAppModule.getLeagueManager().getListLeagueOfUser();
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("SearchClubLeaguePage", respone => {
        this.onExtendsionRespone(respone);
      });
      this.onLoadData();
    });

  }

  ionViewDidEnter() {
    if (this.isDidEnter > 0) {
      this.onResfreshData();
    }
    this.isDidEnter++;
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("SearchClubLeaguePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_CLUB_OF_USER) {
      this.onResponseGET_CLUB_OF_USER(params);
    }
    else if (cmd == Bd69SFSCmd.GET_LIST_MANAGE) {
      this.onResponseGET_LIST_MANAGE(params);
    }
    else if (cmd == Bd69SFSCmd.GET_LEAGUE_OF_USER) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        setTimeout(() => {
          this.mListLeagueMember = this.mAppModule.getLeagueManager().getListLeagueOfUser();
        }, 300);
      }
    }

  }

  onResponseGET_CLUB_OF_USER(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let mListClub = this.mAppModule.getClubManager().onParseSFSArray(content.getSFSArray(ParamsKey.ARRAY));

        let mListClubManager: Array<Clubs> = [];
        let mListClubJoin: Array<Clubs> = [];
        mListClub.forEach(club => {
          if (club.getRoleOfUser() > 1) {
            mListClubManager.push(club);
          } else {
            mListClubJoin.push(club);
          }
        });

        this.mListClubJoin = mListClubJoin;
        this.mListClubManager = mListClubManager;
      }
      this.mAppModule.hideLoading();
    }
  }

  onResponseGET_LIST_MANAGE(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mListLeagueEditor = this.mAppModule.getUserManager().getListManagerLeagueInLeague();

      let content = params.getSFSObject(ParamsKey.CONTENT);
      this.mListClubManagerInLeague = this.mAppModule.getUserManager().onParseClubInLeague(content.getSFSArray(ParamsKey.CLUB_IN_LEAGUES));
    }
  }

  onClickClubJoin(club: Clubs) {
    this.onClickViewClub(club, 0);
  }

  onClickClubManager(club: Clubs) {
    this.isDidEnter = 1;
    this.mListActionSheet = [
      { id: 0, name: "Xem thông tin" },
      { id: 1, name: "Quản lý câu lạc bộ" }
    ]

    this.mAppModule.showActionSheet(club.getName(), this.mListActionSheet, (res) => {
      if (res == 0) {
        this.onClickViewClub(club, 2);
      } else if (res == 1) {
        this.onClickManagerClub(club);
      }
    })

  }

  onClickClubManagerInLeague(club: ManagerClubInLeagues) {
    this.navCtrl.push("ManagerAdminsClubDetailPage", { params: { clubID: club.getClub().getClubID(), leagueID: club.getLeague().getLeagueID(), leagueName: club.getLeague().getName() } });
  }


  onClickViewClub(club: Clubs, role: number) {
    this.navCtrl.push("ViewClubPage", { params: { clubID: club.getClubID(), role: role } });
  }

  onClickManagerClub(club: Clubs) {
    this.navCtrl.push("ViewClubDetailPage", { params: club.getClubID() });
  }

  onClickLeague(item: Leagues) {
    this.navCtrl.push("LeagueDetailPage", { params: item.getLeagueID() });
  }

  onClickLeagueEditor(item: Leagues) {
    this.navCtrl.push("ManagerLeagueEditorToolPage", { params: item.getLeagueID() });
  }

  goToSearchPage() {
    this.navCtrl.push("Bd69SearchPage", { params: (this.mode == "league") ? SEARCH_TYPE.LEAGUE : SEARCH_TYPE.CLUB });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onResfreshData();
      refresher.complete();
    }, 2000);
  }
}
