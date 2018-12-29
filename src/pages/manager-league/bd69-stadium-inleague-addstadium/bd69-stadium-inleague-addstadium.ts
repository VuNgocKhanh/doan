import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Stadium, StadiumInLeague } from '../../../providers/classes/stadium';
import { AppManager } from '../../../providers/manager/app-manager';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the Bd69StadiumInleagueAddstadiumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-stadium-inleague-addstadium',
  templateUrl: 'bd69-stadium-inleague-addstadium.html',
})
export class Bd69StadiumInleagueAddstadiumPage {
  mLeagueID: number = -1;

  nextPage: number = 0;
  page: number = 0;

  searchQuery: string = "";

  isUpdate: boolean = false;

  listStadium: Array<StadiumInLeague> = [];

  listStadiumAdd: Array<StadiumInLeague> = [];

  mListActionSheet: Array<{ id: number, name: string }> = []

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.get("params")) {
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onLoadData() {
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_STADIUM(this.mLeagueID, this.searchQuery, this.nextPage);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69StadiumInleagueAddstadiumPage", response => {
        this.onExtendsionResponse(response);
      });
    });
    this.onLoadData();
  }

  ionViewWillUnLoad() {
    Bd69SFSConnector.getInstance().removeListener("Bd69StadiumInleagueAddstadiumPage");
  }

  onExtendsionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_STADIUM) {
      this.onResponseLEAGUE_SEARCH_STADIUM(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_STADIUM) {
      this.onResponseLEAGUE_ADD_STADIUM(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_STADIUM) {
      this.onResponseLEAGUE_REMOVE_STADIUM(params);
    }
  }

  onResponseLEAGUE_SEARCH_STADIUM(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content.containsKey(ParamsKey.NEXT)) {
        this.nextPage = content.getInt(ParamsKey.NEXT);
      }
    
      this.page = content.getInt(ParamsKey.PAGE);

      if (content.containsKey(ParamsKey.ARRAY)) {
        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        let listStadium: Array<StadiumInLeague> = [];
        for (let i = 0; i < sfsArray.size(); i++) {
          let sfsObject = sfsArray.getSFSObject(i);
          let newStadium = new StadiumInLeague();
          newStadium.fromSFSobject(sfsObject);

          listStadium.push(newStadium);
        }
        if (this.page < 1) {
          this.listStadium = listStadium;
        } else {
          this.listStadium = this.listStadium.concat(listStadium);
        }
      }
    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }


  onResponseLEAGUE_ADD_STADIUM(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Thêm sân vận động thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        let stadiumID = content.getInt(ParamsKey.STADIUM_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);

        let index = this.listStadium.findIndex(stadium => {
          return stadium.getStadiumID() == stadiumID;
        });

        if(index > -1){
          this.listStadium[index].setLeagueID(leagueID);
        }
      }

    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponseLEAGUE_REMOVE_STADIUM(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        let stadiumID = content.getInt(ParamsKey.STADIUM_ID);

        let index = this.listStadium.findIndex(stadium => {
          return stadium.getStadiumID() == stadiumID;
        });

        if(index > -1){
          this.listStadium[index].setLeagueID(-1);
        }
      }

    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickSearch() {
    this.nextPage = 0;
    if (this.nextPage == -1) return;
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_STADIUM(this.mLeagueID, this.searchQuery, this.nextPage);
    })
  }

  onClearQuery() {
    this.searchQuery = "";
    this.nextPage = 0;
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_STADIUM(this.mLeagueID, "a", this.nextPage);
  }

  doSearchLocal(){
    if(this.searchQuery.trim() == ""){
      this.nextPage = 0;
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_STADIUM(this.mLeagueID, "a", this.nextPage);
    }
  }

  onDoneAddStadium() {
    if (this.isUpdate) {
      this.mViewController.dismiss(1);
    } else {
      this.mViewController.dismiss();
    }
  }

  onClickStadium(stadium: StadiumInLeague) {
    if (stadium.getLeagueID() == this.mLeagueID) {
      this.mListActionSheet = [
        { id: 0, name: "Xem thông tin" },
        { id: 1, name: "Xóa sân bóng khỏi giải đấu" },
      ];
      this.mAppModule.showActionSheet(stadium.getName(), this.mListActionSheet, (res) => {
        if (res == 0) {
          this.mAppModule.showModalIonic("StadiumDetailPage", { stadiumID: stadium.getStadiumID() });
        }
        else if (res == 1) {
          // stadium.setLeagueID(-1);
          this.mAppModule.showLoading().then(()=>{
            this.mAppModule.getLeagueManager().sendRequestLEAGUE_REMOVE_STADIUM(this.mLeagueID, stadium.getStadiumID());
          });
        }
      });
    } else if (stadium.getLeagueID() != this.mLeagueID) {
      this.mListActionSheet = [
        { id: 0, name: "Xem thông tin" },
        { id: 1, name: "Thêm sân bóng vào giải đấu" },
      ];
      this.mAppModule.showActionSheet(stadium.getName(), this.mListActionSheet, (res) => {
        if (res == 0) {
          this.mAppModule.showModalIonic("StadiumDetailPage", { stadiumID: stadium.getStadiumID() });
        } else if (res == 1) {
          // stadium.setLeagueID(this.mLeagueID);
          this.mAppModule.showLoading().then(()=>{
            this.mAppModule.getLeagueManager().sendRequestLEAGUE_ADD_STADIUM(this.mLeagueID, stadium.getStadiumID())
          });
        }
      });
    }
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
