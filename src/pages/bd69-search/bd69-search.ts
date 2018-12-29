import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, Item } from 'ionic-angular';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Clubs } from '../../providers/classes/clubs';
import { Leagues } from '../../providers/classes/league';
import { User } from '../../providers/classes/user';
import { SEARCH_TYPE, RequestState, RoleInClub } from '../../providers/manager/constant-manager';
import { SFSCmd } from '../../providers/core/smartfox/sfs-cmd';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Stadium } from '../../providers/classes/stadium';
import { Dornor } from '../../providers/classes/donnor';

@IonicPage()
@Component({
  selector: 'page-bd69-search',
  templateUrl: 'bd69-search.html',
})
export class Bd69SearchPage {
  @ViewChild(Searchbar) mySearchBar: Searchbar;

  message: string = "Tìm kiếm không có kết quả";

  listFillter: Array<{ id: number, name: string }> = [
    { id: 1, name: "Câu lạc bộ" },
    { id: 2, name: "Giải đấu" },
    { id: 3, name: "Cầu thủ" },
    { id: 4, name: "Sân vận động" },
    { id: 5, name: "Nhà tài trợ" }
  ]

  idSelected: number = 1;

  mClubs: Array<Clubs> = [];
  mLeagues: Array<Leagues> = [];
  mUsers: Array<User> = [];
  mStadiums: Array<Stadium> = [];
  mDonors: Array<Dornor> = [];


  nextPage: number = 0;

  page: number = 0;

  searchQuery: string = "";

  lastQuery: string = "";

  isSearchDone : boolean = false;

  constructor(
    private mAppmodule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.idSelected = this.navParams.get("params");
    }
  }


  ionViewDidLoad() {
    if (!this.mAppmodule.isLogin) {
      this.mAppmodule.onSwithToLoading();
      return;
    }

    this.addSFSResponseListener();

    setTimeout(() => {
      this.mySearchBar.setFocus();
    }, 600);

  }

  addSFSResponseListener() {
    Bd69SFSConnector.getInstance().addListener("Bd69SearchPage", response => {
      this.onExtensionResponse(response);
    });
  }


  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    this.mAppmodule.hideLoading();
    this.isSearchDone = true;
    if (cmd == Bd69SFSCmd.SEARCH_LEAGUE) {
      this.onResponeSearchLeague(params);
    } else if (cmd == Bd69SFSCmd.SEARCH_CLUB) {
      this.onResponeSearchClub(params);
    } else if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.onResponeSearchUser(params);
    } else if (cmd == Bd69SFSCmd.SEARCH_STADIUM) {
      this.onResponeSearchStadium(params);
    } else if (cmd == Bd69SFSCmd.SEARCH_DORNOR) {
      this.onResponeSearchDornor(params);
    }
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("Bd69SearchPage");
  }

  onResponeSearchLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);

        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayLeagues = this.mAppmodule.getLeagueManager().onParseLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 0) {
            this.mLeagues = arrayLeagues;
          } else {
            this.mLeagues = this.mLeagues.concat(arrayLeagues);
          }
        }
      }
    } else {
      this.mAppmodule.showParamsMessage(params);
    }
  }

  onResponeSearchClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }

        this.page = content.getInt(ParamsKey.PAGE);

        let arrayClubs = this.mAppmodule.getClubManager().onParseSFSArray(content.getSFSArray(ParamsKey.ARRAY));

        if (this.page < 1) {
          this.mClubs = arrayClubs;
        } else {
          this.mClubs = this.mClubs.concat(arrayClubs);
        }
      }
    } else {
      this.mAppmodule.showParamsMessage(params);
    }
  }

  onResponeSearchUser(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);

        let arrayUsers = this.mAppmodule.getLeagueManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));

        if (this.page < 1) {
          this.mUsers = arrayUsers;
        } else {
          this.mUsers = this.mUsers.concat(arrayUsers);
        }
      }

    } else {
      this.mAppmodule.showParamsMessage(params);
    }

  }


  onResponeSearchStadium(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }

        this.page = content.getInt(ParamsKey.PAGE);

        let arrayStadiums = this.mAppmodule.getLeagueManager().onParseStadiumList(content.getSFSArray(ParamsKey.ARRAY));

        if (this.page < 1) {
          this.mStadiums = arrayStadiums;
        } else {
          this.mStadiums = this.mStadiums.concat(arrayStadiums);
        }

      }

    } else {
      this.mAppmodule.showParamsMessage(params);
    }
  }

  onResponeSearchDornor(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }

        this.page = content.getInt(ParamsKey.PAGE);

        let arrayDornors = this.mAppmodule.getLeagueManager().onResponeDornorSFSArray(content.getSFSArray(ParamsKey.ARRAY));

        if (this.page < 1) {
          this.mDonors = arrayDornors;
        } else {
          this.mDonors = this.mDonors.concat(arrayDornors);
        }

      }
    } else {
      this.mAppmodule.showParamsMessage(params);
    }
  }


  search() {
    if (this.searchQuery.trim() != '') {
      this.isSearchDone = false;

      if (this.searchQuery != this.lastQuery) {
        this.lastQuery = this.searchQuery;
        this.nextPage = 0;
        this.page = 0;
      }

      if (this.nextPage == -1) return;

      this.mAppmodule.showLoading().then(() => {
        if (this.idSelected == SEARCH_TYPE.CLUB) {
          this.mAppmodule.getClubManager().sendRequestSearchClub(this.searchQuery, this.nextPage);
        } else if (this.idSelected == SEARCH_TYPE.LEAGUE) {
          this.mAppmodule.getLeagueManager().sendRequestSearchLeague(this.searchQuery, this.nextPage);
        } else if (this.idSelected == SEARCH_TYPE.USER) {
          this.mAppmodule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
        } else if (this.idSelected == SEARCH_TYPE.STADIUM) {
          this.mAppmodule.getLeagueManager().sendRequestSearchStadium(this.searchQuery, this.nextPage);
        } else if (this.idSelected == SEARCH_TYPE.DONOR) {
          this.mAppmodule.getLeagueManager().sendRequestSearchDonor(this.searchQuery, this.nextPage);
        } else {
          this.mAppmodule.hideLoading();
          this.isSearchDone = true;
        }
      });
    }
  }

  onSelectFillter(item) {
    this.idSelected = item.id;
    this.nextPage = 0;
    this.clearArray();
    this.search();
  }



  clearArray() {
    this.mUsers = [];
    this.mStadiums = [];
    this.mLeagues = [];
    this.mClubs = [];
    this.mDonors = [];
  }

  clearQuery() {
    this.searchQuery = "";
    this.lastQuery = "";
    this.nextPage = 0;
    this.clearArray();
  }


  goToViewClub(item: Clubs) {
    this.navCtrl.push("ViewClubPage", { params: { clubID: item.getClubID() } });
  }

  onClickLeague(item: Leagues) {
    this.navCtrl.push("LeagueDetailPage", { params: item.getLeagueID() });
  }

  onClickStadium(item: Stadium) {
    this.navCtrl.push("StadiumDetailPage", { stadiumID: item.getStadiumID() });
  }

  onClickDonor(item: Dornor) {
    // this.navCtrl.push("DonorPage", { dornorID: item.getDornorID() });
  }

  onClickPlayer(user: User) {
    this.navCtrl.push("ProfilePage", { params: user.getUserID() });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.search();
      infiniteScroll.complete();
    }, 500);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.search();
      refresher.complete();
    }, 2000);
  }
}
