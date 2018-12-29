import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { LeagueManager } from '../../../providers/manager/league-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { DornorInLeague } from '../../../providers/classes/donnor';

@IonicPage()
@Component({
  selector: 'page-bd69-dornors-inleague-add',
  templateUrl: 'bd69-dornors-inleague-add.html',
})
export class Bd69DornorsInleagueAddPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  showTextNoDornor: boolean = true;

  showTextNoResult : boolean = false;

  page: number = 0;
  mDornorList: Array<DornorInLeague> = [];
  mLeagueID: number = -1;
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
      this.mAppModule.addBd69SFSResponeListener("Bd69DornorsInleagueAddPage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onloadeddata();
  }

  ionViewWillUnload(){
    this.mAppModule.removeSFSListener("Bd69DornorsInleagueAddPage");
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.mLeagueID = this.navParams.get('params');
    }
  }

  onloadeddata() {
    LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, null, this.nextPage);
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_DORNOR) {
      this.onParseListDornorParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_DORNOR) {
      this.onResponeAddNewDornorParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_DORNOR) {
      this.onResponeDeleteDornorParams(params);
    }
  }

  onResponeAddNewDornorParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Thêm nhà tài trợ thành công");

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.DORNOR_ID);
        let index = this.mDornorList.findIndex(dor => {
          return dor.getDornorID() == id;
        })
        if (index > -1) {
          this.mDornorList[index].setLeagueID(this.mLeagueID);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeDeleteDornorParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.DORNOR_ID);
        let index = this.mDornorList.findIndex(dor => {
          return dor.getDornorID() == id;
        })
        if (index > -1) {
          this.mDornorList[index].setLeagueID(-1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListDornorParams(params) {
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
          let mDornor = this.mAppModule.getLeagueManager().onResponeDornorInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mDornorList = [];
            this.mDornorList = mDornor;
          } else {
            this.mDornorList = this.mDornorList.concat(mDornor);
          }

          if(this.mDornorList.length == 0){
            if(this.searchQuery.trim() == ""){
              this.showTextNoDornor = true;
              this.showTextNoResult = false;
            }else{
              this.showTextNoDornor = false;
              this.showTextNoResult = true;
            }
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickDornor(dornor: DornorInLeague) {
    let options = [
      { id: 1, name: "Huỷ làm nhà tài trợ" }
    ];
    if (dornor.getLeagueID() != this.mLeagueID) {
      options[0].name = "Chọn làm nhà tài trợ";
    }
    this.mAppModule.showActionSheet(dornor.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          if (dornor.getLeagueID() == this.mLeagueID) {

            this.mAppModule.showLoading().then(() => {
              LeagueManager.getInstance().sendRequestLEAGUE_REMOVE_DORNOR(dornor.getDornorID(), this.mLeagueID);
            });
          } else {
            this.mAppModule.showLoading().then(() => {
              LeagueManager.getInstance().sendRequestLEAGUE_ADD_DORNOR(dornor.getDornorID(), this.mLeagueID);
            });

          }
        }
      }
    })
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
          LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
      }

    }
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.nextPage = 0;
      LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, null, this.nextPage);
    }
  }

  clear() {
    this.nextPage = 0;
    LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, null, this.nextPage);
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
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
      }
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.mDornorList = [];
      if (this.searchQuery != "") {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(this.mLeagueID, null, this.nextPage);
      }
      refresher.complete();
    }, 2000);
  }
}
