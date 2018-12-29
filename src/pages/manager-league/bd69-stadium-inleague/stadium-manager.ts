import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, AlertController } from 'ionic-angular';
import { Leagues } from '../../../providers/classes/league';
import { Stadium, StadiumInLeague } from '../../../providers/classes/stadium';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { ContentType } from '@angular/http/src/enums';




@IonicPage()
@Component({
  selector: 'page-stadium-manager',
  templateUrl: 'stadium-manager.html',
})
export class StadiumManagerPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  mLeague: Leagues = new Leagues();

  mListStadium: Array<Stadium> = [];

  searchQuery: string = "";
  nextPage: number = 0;
  page: number = 0;
  numberEnter : number = 0;

  mListActionSheet: Array<{ id: number, name: string }> = [
    { id: 0, name: "Xem thông tin" },
    { id: 1, name: "Xóa sân bóng khỏi giải đấu" },
  ]

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague.setLeagueID(this.navParams.get("params"));
    }
  }

  onLoadData() {
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_STATIDUM(this.mLeague.getLeagueID(), this.nextPage);
  }

  ionViewDidLoad() {

    if(!this.mAppModule.isLogin){
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("StadiumManagerPage", respone => {
        this.onExtendsionRequest(respone);
      });

      this.onLoadData();

    });

  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("StadiumManagerPage");
  }

  // ionViewDidEnter(){
  //   if(this.numberEnter == 1){
  //     this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_STATIDUM(this.mLeague.getLeagueID(), this.nextPage);
  //   }
  // }

  onExtendsionRequest(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_STATIDUM) {
      this.onResponseLEAGUE_GET_LIST_STATIDUM(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_STADIUM) {
      this.onResponseRemoveStadium(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_STADIUM) {
      this.onResponeAddStadiumIntoLeague(params);
    }
  }

  onResponseLEAGUE_GET_LIST_STATIDUM(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ARRAY)) {
        if (content.containsKey(ParamsKey.PAGE)) {
          this.page = content.getInt(ParamsKey.PAGE);
        }
        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        }

        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        let mListStadium: Array<Stadium> = [];
        for (let i = 0; i < sfsArray.size(); i++) {
          let sfsObject = sfsArray.getSFSObject(i);
          let newStadium = new Stadium();
          newStadium.fromSFSobject(sfsObject);

          mListStadium.push(newStadium);
        }

        if (this.page < 1) {
          this.mListStadium = mListStadium;
        } else {
          this.mListStadium = this.mListStadium.concat(mListStadium);
        }
      }
    } else {
      this.mAppModule.showToast("Khong the lay du lieu tu server")
    }
    this.mAppModule.hideLoading();
  }

  onResponeAddStadiumIntoLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (leagueID == this.mLeague.getLeagueID()) {
          if (content.containsKey(ParamsKey.INFO)) {
            let newStadium = new StadiumInLeague();
            newStadium.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
            this.mListStadium.push(newStadium);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponseRemoveStadium(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Xóa sân bóng khỏi giải đấu thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let stadiumID = content.getInt(ParamsKey.STADIUM_ID);

        let index = this.mListStadium.findIndex(stadium => {
          return stadium.getStadiumID() == stadiumID;
        });

        if (index > -1) {
          this.mListStadium.splice(index, 1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  // onClickSearch() {
  //   this.mAppModule.showLoading().then(() => {
  //     this.mListStadium = [];
  //     this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_STADIUM(this.mLeague.getLeagueID(), this.searchQuery);
  //   })
  // }

  // onClearQuer() {
  //   this.onLoadData();
  // }

  onClickAddStadiumIntoLeague() {
    this.numberEnter = 1;
    this.navCtrl.push("Bd69StadiumInleagueAddstadiumPage", { params: this.mLeague.getLeagueID() });
  }

  onClickStadiumInLeague(stadium: Stadium) {
    this.mAppModule.showActionSheet(stadium.getName(), this.mListActionSheet, (res) => {
      if (res == 0) {
        this.onClickViewStadiumInfo(stadium);
      } else if (res == 1) {
        this.onClickRemoveStadium(stadium);
      }
    })
  }

  onClickViewStadiumInfo(stadium: Stadium) {
    this.mAppModule.showModalIonic("StadiumDetailPage", { stadiumID: stadium.getStadiumID() });
  }

  onClickRemoveStadium(stadium: Stadium) {
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_REMOVE_STADIUM(this.mLeague.getLeagueID(), stadium.getStadiumID());
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {

      this.onLoadData();

      infiniteScroll.complete();
    }, 1000);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.nextPage = 0;
      this.onLoadData();

      refresher.complete();
    }, 1500);
  }
}
