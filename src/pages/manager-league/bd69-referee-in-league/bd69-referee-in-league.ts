import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Referee, RefereInLeague } from '../../../providers/classes/referee';
import { RefereeManager } from '../../../providers/manager/referee-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Utils } from '../../../providers/core/app/utils';
import { AppManager } from '../../../providers/manager/app-manager';
import { LeagueManager } from '../../../providers/manager/league-manager';

/**
 * Generated class for the Bd69RefereeInLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ListModels {
  item: Referee;
  checked: boolean;
}

@IonicPage()
@Component({
  selector: 'page-bd69-referee-in-league',
  templateUrl: 'bd69-referee-in-league.html',
})
export class Bd69RefereeInLeaguePage {

  @ViewChild("idsearch") ele: ElementRef;
  @ViewChild(Searchbar) mSearchbar: Searchbar;

  nextPage: number = 0;

  page: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  mActionSheetOptions: Array<{ id: number, name: string }> = [];

  mListReferee: Array<Referee> = [];

  mReferees: Array<RefereInLeague> = [];

  mLeagueID: number = -1;

  isShowSearchBar: boolean = false;

  mListSearch: Array<ListModels> = [];

  lastQuery: string = "";

  load: number = 0;

  showTextNoReferee : boolean = true;

  showTextNoResult : boolean = false;

  constructor(
    private mRenderer2: Renderer2,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
    this.onLoadActionSheetOptions();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onClickSearchReferee() {
    if (this.searchQuery.trim() != "" && this.searchQuery.length > 0) {
      if (Utils.bodauTiengViet(this.lastQuery).toLowerCase() != Utils.bodauTiengViet(this.searchQuery).toLowerCase()) {
        this.nextPage = 0;
        this.page = 0;
        this.mReferees = [];
      }
      this.mAppModule.showLoading().then(() => {
        RefereeManager.getInstance().sendRequestSEARCH_REFEREE(this.searchQuery, this.nextPage);
      });
    }
  }

  onLoadListModels(array: Array<Referee>) {
    if (this.nextPage < 1 || this.page < 1) {
      this.mListSearch = [];
    }
    for (let i = 0; i < array.length; i++) {
      let newReferee = array[i];
      this.mListSearch.push({
        item: newReferee,
        checked: this.onCheckRefereeIsAddToLeague(newReferee.getRefereeID())
      });
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69RefereeInLeaguePage", respone => {
        this.onExtendsionRespone(respone);
      });

    this.onLoadData();

    });
    // this.mAppModule._LoadAppConfig().then(() => {
    //   this.mAppModule.addBd69SFSResponeListener("Bd69RefereeInLeaguePage", respone => {
    //     this.onExtendsionRespone(respone);
    //   });

    // RefereeManager.getInstance().sendRequestGET_LIST_REFEREE_IN_LEAGUE(this.mLeagueID);
    // });
  }

  ionViewDidEnter() {
    if(this.load > 0){
      LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, null, this.nextPage);
    }
    this.load++;
  }

  onLoadData() {
    LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, null, this.nextPage);
    // this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_REFEREE();
  }


  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69RefereeInLeaguePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_REFEREE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content) {
          if (content.containsKey(ParamsKey.NEXT)) {
            this.nextPage = content.getInt(ParamsKey.NEXT);
          } else {
            this.nextPage = -1;
          }
          this.page = content.getInt(ParamsKey.PAGE);

          if (content.containsKey(ParamsKey.ARRAY)) {
            // let mDornors = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
            let mReferee = RefereeManager.getInstance().onParseSFSRefereeInLeagueArray(sfsArray, leagueID);
            if (this.page < 1) {
              this.mReferees = mReferee;
            } else {
              this.mReferees = this.mReferees.concat(mReferee);
            }

            if(this.mReferees.length == 0){
              if(this.searchQuery.trim() != ""){
                this.showTextNoResult = true;
                this.showTextNoReferee = false;
              }else{
                this.showTextNoResult = false;
                this.showTextNoReferee = true;
              }
            }
          }
        }

        // this.mReferees = RefereeManager.getInstance().onParseSFSRefereeInLeagueArray(sfsArray,leagueID);

      } else {
        this.mAppModule.showParamsMessage(params);
      }
      this.mAppModule.hideLoading();
    }

    if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_REFEREE) {
      this.mAppModule.hideLoading();
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let refereeID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.REFEREE_ID);
        if (this.isShowSearchBar) {
          let index = this.mListSearch.findIndex(item => {
            return item.item.getRefereeID() == refereeID;
          })
          if (index > -1) {
            this.mListSearch[index].checked = false;
            let newIndex = this.mReferees.findIndex(ref => {
              return ref.getRefereeID() == refereeID;
            })
            if (newIndex > -1) {
              this.mReferees.splice(newIndex, 1);
            }
          }
        } else {
          let newIndex = this.mReferees.findIndex(ref => {
            return ref.getRefereeID() == refereeID;
          })
          if (newIndex > -1) {
            this.mReferees.splice(newIndex, 1);

          }
        }

        if(this.mReferees.length == 0 ){
          this.showTextNoReferee = true;
          this.showTextNoResult = false;
        }
        
        this.mAppModule.showToast("Hủy trọng tài thành công");
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }

    if (cmd == Bd69SFSCmd.ADD_REFEREE_INTO_LEAGUE) {
      this.mAppModule.hideLoading();

      if (params.getInt(ParamsKey.STATUS) == 1) {
        let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
        let refereeID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.REFEREE_ID);

        if (this.isShowSearchBar) {
          let index = this.mListSearch.findIndex(item => {
            return item.item.getRefereeID() == refereeID;
          })
          if (index > -1) {
            let newRefereeInLeague = new RefereInLeague();
            newRefereeInLeague.fromSFSObject(info);
            this.mReferees.push(newRefereeInLeague);
            this.mListSearch[index].checked = true;
          }
        } else {
          let index = this.mReferees.findIndex(ref => {
            return ref.getRefereeID() == refereeID;
          })
          if (index > -1) {
            this.mReferees[index].fromSFSObject(info);
          }
        }
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }

    if (cmd == Bd69SFSCmd.SEARCH_REFEREE) {
      this.mAppModule.hideLoading();
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);

        let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
        let refereArray = RefereeManager.getInstance().onParseSFSArray(sfsArray);
        if (refereArray.length > 0) {
          this.onLoadListModels(refereArray);
        }
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
  }

  onCheckRefereeIsAddToLeague(refereID: number): boolean {
    if (this.mReferees.length == 0) return false;
    for (let ref of this.mReferees) {
      if (ref.getRefereeID() == refereID) {
        return true;
      }
    }
    return false;
  }

  onClickAddRemoveReferee(item: ListModels) {
    // item.checked = !item.checked;
    if (item.checked) {
      this.mAppModule.showLoading().then(() => {
        this.removeRefereeInToLeague(item.item.getRefereeID());
      });
    } else {
      this.mAppModule.showLoading().then(() => {
        this.addRefereeInToLeague(item.item.getRefereeID());
      });
    }
  }

  addRefereeInToLeague(id: number) {
    this.mAppModule.showLoading().then(() => {
      RefereeManager.getInstance().sendRequestADD_REFEREE_INTO_LEAGUE(id, this.mLeagueID);
    });
  }

  onClickAddRefereeToLeague(item: RefereInLeague) {
    this.addRefereeInToLeague(item.getRefereeID());
  }

  onClickAdd() {
    this.load = 1;
    this.navCtrl.push("Bd69RefereeInLeagueAddPage", { params: this.mLeagueID });

    // this.mAppModule.showModalIonic("Bd69RefereeInLeagueAddPage", {params: this.mLeagueID}, (newRef: RefereInLeague) => {
    //   if (newRef) {
    //     let newReferee = new RefereInLeague();
    //     newReferee.fromObject(newRef);
    //     this.mReferees.unshift(newReferee);
    //   }
    // })
  }

  removeRefereeInToLeague(id: number) {
    this.mAppModule.showLoading().then(() => {
      RefereeManager.getInstance().sendRequestREMOVE_REFEREE_FROM_LEAGUE(id, this.mLeagueID);
    });
  }

  onClickItem(referee: RefereInLeague) {
    this.mAppModule.showActionSheet(referee.getName(), this.mActionSheetOptions, (id) => {
      if (id) {
        if (id == 1) {
          this.mAppModule.showLoading().then(() => {
            LeagueManager.getInstance().sendRequestLEAGUE_REMOVE_REFEREE(referee.getRefereeID(), this.mLeagueID);
          });
        }
      }
    })
  }
  // onClickSearch() {

  //   this.isShowSearchBar = !this.isShowSearchBar;
  //   if(this.isShowSearchBar){
  //     setTimeout(() => {
  //       this.mSearchbar.setFocus();
  //     }, 500);
  //   }
  // }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.nextPage = 0;
      LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, null, this.nextPage);
    }
  }

  clearQuery(){
    this.searchQuery = "";
    this.nextPage = 0;
    LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, null, this.nextPage);
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.nextPage = 0;
        this.page = 0;
        this.oldSearchQuery = this.searchQuery;
      }
      if(this.nextPage == -1) return;
      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
      }

    }
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      // { id: 1, name: "Cập nhật thông tin" },
      { id: 1, name: "Huỷ làm trọng tài" }
    ];
  }

  onClickClose() {
    this.isShowSearchBar = false;
    this.searchQuery = "";
    this.mListSearch = [];
  }

  onClickReferee(item: RefereInLeague) {
    if (item.getLeagueID() == -1) return;
    let array = [
      { id: 0, name: "Xem thông tin" },
      { id: 1, name: "Cập nhật thông tin" },
      { id: 2, name: "Xoá" }
    ]
    this.mAppModule.showActionSheet(item.getName(), array, (id) => {
      if (id == 2) {
        this.removeRefereeInToLeague(item.getRefereeID());
      }
    });
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
        this.onLoadData();
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
      }
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      if (this.searchQuery != "") {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, this.searchQuery, this.nextPage);
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, null, this.nextPage);
      }
      refresher.complete();
    }, 2000);
  }
}
