import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { LeagueManager } from '../../../providers/manager/league-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Referee, RefereInLeague } from '../../../providers/classes/referee';

/**
 * Generated class for the Bd69RefereeInLeagueAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-referee-in-league-add',
  templateUrl: 'bd69-referee-in-league-add.html',
})
export class Bd69RefereeInLeagueAddPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  mLeagueID: number = -1;

  mListReferee: Array<RefereInLeague> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider, ) {
    this.onLoadParams();
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69RefereeInLeagueAddPage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onloadeddata();
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.mLeagueID = this.navParams.get('params');
    }
  }

  onloadeddata() {
    LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_REFEREE(this.mLeagueID, null, this.nextPage);
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_REFEREE) {
      this.onParseListRefereeParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_REFEREE) {
      this.onResponeAddNewRefereeParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_REFEREE) {
      this.onResponeDeleteRefereeParams(params);
    }
  }

  onResponeAddNewRefereeParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.REFEREE_ID);
        let index = this.mListReferee.findIndex(ref => {
          return ref.getRefereeID() == id;
        })
        if (index > -1) {
          this.mListReferee[index].setLeagueID(this.mLeagueID);
        }
      }
      this.mAppModule.showToast("Thêm trọng tài thành công");
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeDeleteRefereeParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.REFEREE_ID);
        let index = this.mListReferee.findIndex(ref => {
          return ref.getRefereeID() == id;
        })
        if (index > -1) {
          this.mListReferee[index].setLeagueID(-1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListRefereeParams(params) {
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
          let mReferee = this.mAppModule.getLeagueManager().onResponeRefereeSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListReferee = [];
            this.mListReferee = mReferee;
          } else {
            this.mListReferee = this.mListReferee.concat(mReferee);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.nextPage = 0;
        this.page = 0;
        this.oldSearchQuery = this.searchQuery;
      }
      if (this.nextPage == -1) return;
      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
      }

    }
  }

  onClickReferee(referee: RefereInLeague) {
    let options = [
      // {id: 1, name: "Cập nhật thông tin"},
      { id: 1, name: "Huỷ làm trọng tài" }
    ];
    if (referee.getLeagueID() != this.mLeagueID) {
      options[0].name = "Chọn làm trọng tài";
    }
    this.mAppModule.showActionSheet(referee.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          // this.goToProfileUser(referee);
          if (referee.getLeagueID() == this.mLeagueID) {

            this.mAppModule.showLoading().then(() => {
              LeagueManager.getInstance().sendRequestLEAGUE_REMOVE_REFEREE(referee.getRefereeID(), this.mLeagueID);
            });
          } else {
            this.mAppModule.showLoading().then(() => {
              LeagueManager.getInstance().sendRequestLEAGUE_ADD_REFEREE(referee.getRefereeID(), this.mLeagueID);
            });
          }
        }
      }
    })
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.onloadeddata();
    }
  }
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onScroll();
      infiniteScroll.complete();
    }, 500);
  }

  onScroll() {
    if (this.nextPage > -1) {
      if (this.searchQuery.trim() == '') {
        this.onloadeddata();
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
      }
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.mListReferee = [];
      if (this.searchQuery != "") {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_REFEREE(this.mLeagueID, null, this.nextPage);
      }
      refresher.complete();
    }, 2000);
  }

}
