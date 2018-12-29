import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Dornor, DornorInLeague } from '../../../providers/classes/donnor';
import { Leagues } from '../../../providers/classes/league';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { LeagueManager } from '../../../providers/manager/league-manager';
import { ConstantManager, DornorLevel } from '../../../providers/manager/constant-manager';

// export interface Donor {
//   name: string;
//   logo: string;
//   description: string;
//   website: string;
//   facebook: string;
//   youtube: string;
// }

export interface ListModels {
  item: Dornor;
  checked: boolean;
}

@IonicPage()
@Component({
  selector: 'page-donor',
  templateUrl: 'donor.html',
})
export class DonorPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  searchQuery: string = "";

  isShowSearchBar: boolean = false;

  oldSearchQuery: string = "";

  page: number = 0;

  mListSearch: Array<ListModels> = [];

  nextPage: number = 0;
  load: number = -1;
  mLeagueID: number = -1;
  mActionSheetOptions: Array<{ id: number, name: string }> = [];
  name_storage: string = "bbb";
  donorList: Array<Dornor> = [];
  mLeague: Leagues = new Leagues();
  mDornorList: Array<DornorInLeague> = [];

  showTextNoDornor: boolean = true;
  showTextNoResult : boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider,
  ) {
    this.onLoadParams();
    this.onLoadActionSheetOptions();
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("DonorPage", respone => {
        this.onExtendsionRespone(respone);
      });
    });
    this.onLoadData();
  }

  onLoadData() {
    LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, null, this.nextPage);
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_DORNOR) {
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
            let mDornors = this.mAppModule.getLeagueManager().onResponeDornorInLeagueSFSArray(sfsArray, leagueID);
            if (this.page < 1) {
              this.mDornorList = mDornors;
            } else {
              this.mDornorList = this.mDornorList.concat(mDornors);
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
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_DORNOR) {
      this.mAppModule.hideLoading();
      if (params.getInt(ParamsKey.STATUS) == 1) {

        this.mAppModule.showToast("Hủy nhà tài trợ thành công");

        let dornorID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.DORNOR_ID);
        if (this.isShowSearchBar) {
          let index = this.mListSearch.findIndex(item => {
            return item.item.getDornorID() == dornorID;
          })
          if (index > -1) {
            this.mListSearch[index].checked = false;
            let newIndex = this.mDornorList.findIndex(dor => {
              return dor.getDornorID() == dornorID;
            })
            if (newIndex > -1) {
              this.mDornorList.splice(newIndex, 1);
            }
          }
        } else {
          let newIndex = this.mDornorList.findIndex(dor => {
            return dor.getDornorID() == dornorID;
          })
          if (newIndex > -1) {
            this.mDornorList.splice(newIndex, 1);
          }
        }

        if(this.mDornorList.length == 0){
          this.showTextNoDornor = true;
          this.showTextNoResult = false;
        }
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_DORNOR_INFO) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.mAppModule.showToast("Cập nhật thành công");
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      { id: 1, name: "Chọn làm nhà tại trợ kim cương" },
      { id: 2, name: "Chọn làm nhà tại trợ vàng" },
      { id: 3, name: "Chọn làm nhà tại trợ bạc" },
      { id: 4, name: "Chọn làm nhà tại trợ đồng" },
      { id: 5, name: "Huỷ làm nhà tài trợ" }
    ];
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("DonorPage");
  }

  ionViewDidEnter() {
    if (this.load == 1) {
      LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID);
    }
  }

  onResponeSFSDonorArray(sfsArray) {
    if (!sfsArray) return;
    this.donorList = this.mAppModule.getUserManager().onResponeDornorSFSArray(sfsArray);
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      // this.mLeague.setLeagueID(this.navParams.get("params"));
      this.mLeagueID = this.navParams.get('params');
    }
  }

  onClickAdd() {
    this.load = 1;
    this.navCtrl.push("Bd69DornorsInleagueAddPage", { params: this.mLeagueID });
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
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
      }
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
          LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
      }

    }
  }

  clearQuery(){
    this.searchQuery = "";
    this.nextPage = 0;
    LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, null, this.nextPage);
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.nextPage = 0;
      this.onLoadData();
    }
  }

  onClickItem(dornor: DornorInLeague) {
    this.mAppModule.showActionSheet(dornor.getName(), this.mActionSheetOptions, (id) => {
      if (id) {
        if (id == 1) {
          LeagueManager.getInstance().sendRequestLEAGUE_UPDATE_DORNOR_INFO(dornor.getDornorID(), this.mLeagueID, DornorLevel.DIAMOND_DORNOR);
        }
        if (id == 2) {
          LeagueManager.getInstance().sendRequestLEAGUE_UPDATE_DORNOR_INFO(dornor.getDornorID(), this.mLeagueID, DornorLevel.GOLD_DORNOR);
        }
        if (id == 3) {
          LeagueManager.getInstance().sendRequestLEAGUE_UPDATE_DORNOR_INFO(dornor.getDornorID(), this.mLeagueID, DornorLevel.SILVER_DORNOR);

        }
        if (id == 4) {
          LeagueManager.getInstance().sendRequestLEAGUE_UPDATE_DORNOR_INFO(dornor.getDornorID(), this.mLeagueID, DornorLevel.BRONZE_DORNOR);

        }
        if (id == 5) {
          this.mAppModule.showLoading().then(() => {
            LeagueManager.getInstance().sendRequestLEAGUE_REMOVE_DORNOR(dornor.getDornorID(), this.mLeagueID);
          });
        }
      }
    })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      if (this.searchQuery != "") {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, null, this.nextPage);
      }
      refresher.complete();
    }, 2000);
  }
}
