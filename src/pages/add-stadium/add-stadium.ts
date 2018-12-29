import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Stadium } from '../../providers/classes/stadium';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Leagues } from '../../providers/classes/league';


export interface StadiumModels {
  stadium: Stadium;
  checked: boolean;
}
@IonicPage()
@Component({
  selector: 'page-add-stadium',
  templateUrl: 'add-stadium.html',
})
export class AddStadiumPage {

  mLeague: Leagues = new Leagues();

  searchQuery: string = "";

  number_result: number;

  mStadiumChecked: Array<Stadium> = [];

  mStadiumModels: Array<StadiumModels> = [];

  nextPage: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mViewController: ViewController,
    public mStadiumController: Stadium,
    public mAppmodule: AppModuleProvider
  ) {

  }

  ionViewDidLoad() {
    this.onLoadParams();
    this.mAppmodule._LoadAppConfig().then(() => {
      this.addSFSResponseListener();
    })
    this.mStadiumModels = [];
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      let params = this.navParams.get("params");
      this.mLeague = params["league"];
      this.mStadiumChecked = params["stadiums"];
    }
  }

  addSFSResponseListener() {
    Bd69SFSConnector.getInstance().addListener("AddStadiumPage", response => {
      this.onExtensionResponse(response);
    });
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (cmd == Bd69SFSCmd.SEARCH_STADIUM) {

      this.mAppmodule.hideLoading();

      if (params.getInt(ParamsKey.STATUS) == 1) {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        } else {
          this.nextPage = -1;
        }
        this.onResponeSFSStadiumArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));


      } else {
        this.mAppmodule.showToast("Khong lay duoc du lieu tu server")
      }
    }

    if (cmd == Bd69SFSCmd.ADD_STADIUM_INTO_LEAGUE) {
      this.mAppmodule.hideLoading();

      if (params.getInt(ParamsKey.STATUS) == 1) {
        let stadiumID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.STADIUM_ID);
        let index = this.mStadiumModels.findIndex(item => {
          return item.stadium.getStadiumID() == stadiumID;
        })
        if (stadiumID > -1) {
          this.mStadiumModels[index].checked = true;
          this.mStadiumChecked.push(this.mStadiumModels[index].stadium);
        }
      }
    }

    if (cmd == Bd69SFSCmd.REMOVE_STADIUM_FROM_LEAGUE) {
      this.mAppmodule.hideLoading();

      if (params.getInt(ParamsKey.STATUS) == 1) {
        let stadiumID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.STADIUM_ID);
        let index = this.mStadiumModels.findIndex(item => {
          return item.stadium.getStadiumID() == stadiumID;
        })
        if (stadiumID > -1) {
          this.mStadiumModels[index].checked = false;
        }
        let indexInChecked = this.mStadiumChecked.findIndex(ele => {
          return ele.getStadiumID() == stadiumID;
        })
        if (indexInChecked > -1) this.mStadiumChecked.splice(indexInChecked, 1);
      }
    }



  }

  onResponeSFSStadiumArray(sfsArray) {
    if (!sfsArray) return;
    let arraySearch = this.mAppmodule.getLeagueManager().onParseStadiumList(sfsArray);
    if (this.nextPage == 0) {
      this.mStadiumModels = [];
    }
    arraySearch.forEach(ele => {
      this.mStadiumModels.push({
        stadium: ele,
        checked: this.onCheckedStadium(ele.getStadiumID())
      })
    })

  }

  onCheckedStadium(stadiumID: number) {
    let check = false;
    for (let i = 0; i < this.mStadiumChecked.length; i++) {
      if (this.mStadiumChecked[i].getStadiumID() == stadiumID) {
        check = true;
        break;
      }
    }
    return check;
  }

  clearQuery() {
    this.searchQuery = "";
  }

  search() {
    if (this.searchQuery != '' && this.mAppmodule.getUserManager().getUser().getUserID() > -1) {
      this.mAppmodule.showLoading().then(() => {
        this.mStadiumModels = [];
        this.nextPage = 0;
        if (this.nextPage > -1) this.mAppmodule.getLeagueManager().sendRequestSearchStadium(this.searchQuery, this.nextPage);
      })
    }
  }

  onScroll() {
    if (this.nextPage > -1) {
      this.mAppmodule.getLeagueManager().sendRequestSearchStadium(this.searchQuery, this.nextPage);
    }
  }

  onClickStadium(item: StadiumModels) {
    this.mAppmodule.showLoading().then(()=>{
      if (item.checked) {
        this.mAppmodule.getLeagueManager().sendRequestRemoveStadiumInLeague(item.stadium.getStadiumID(), this.mLeague.getLeagueID());
      } else {
        this.mAppmodule.getLeagueManager().sendRequestAddStadiumInLeague(item.stadium.getStadiumID(), this.mLeague.getLeagueID());
      }
    })
   
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onScroll();
      infiniteScroll.complete();
    }, 500);
  }
}

