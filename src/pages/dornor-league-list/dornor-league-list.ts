import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Dornor } from '../../providers/classes/donnor';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Leagues } from '../../providers/classes/league';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';

/**
 * Generated class for the DornorLeagueListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface ListModels {
  dornor: Dornor;
  checked: boolean;
}

@IonicPage()
@Component({
  selector: 'page-dornor-league-list',
  templateUrl: 'dornor-league-list.html',
})
export class DornorLeagueListPage {

  searchQuery: string = "";

  mListChecked: Array<Dornor> = [];

  mListModels: Array<ListModels> = [];

  mLeague: Leagues = new Leagues();

  nextPage: number = 0;
  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  onLoadParams() {
    if (this.navParams.data['params']) {
      let params = this.navParams.get("params");
      this.mLeague = params["league"];
      this.mListChecked = params["list"];
    }
  }

  ionViewDidLoad() {
    this.onLoadParams();
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("DornorLeagueListPage", response => {
        this.onExtendsionRequest(response);
      })
    })
  }

  onExtendsionRequest(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.SEARCH_DORNOR) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        if (content.containsKey("next")) {
          this.nextPage = content.getInt("next");
        }
        this.onParseDornorList(content.getSFSArray(ParamsKey.ARRAY));
      } else {
        this.mAppModule.showToast(params.getUtfString(ParamsKey.MESSAGE));
      }
    }

    else if (cmd == Bd69SFSCmd.ADD_DORNOR_INTO_LEAGUE) {
      this.onResponeAddDornorIntoLeague(params);
    }

    else if (cmd == Bd69SFSCmd.REMOVE_DORNOR_FROM_LEAGUE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let dornorID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.DORNOR_ID);
        let index = this.mListModels.findIndex(item => {
          return item.dornor.getDornorID() == dornorID;
        })
        if (index > -1) {
          this.mListModels[index].checked = false;
        }
        let indexInChecked = this.mListChecked.findIndex(ele => {
          return ele.getDornorID() == dornorID;
        })
        if (indexInChecked > -1) this.mListChecked.splice(indexInChecked, 1);
      } else {
        this.mAppModule.showToast(params.getUtfString(ParamsKey.MESSAGE));
      }
    }

    this.mAppModule.hideLoading();
  }

  onResponeAddDornorIntoLeague(params){
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        let dornorID = content.getInt(ParamsKey.DORNOR_ID);
        let index = this.mListModels.findIndex(item => {
          return item.dornor.getDornorID() == dornorID;
        })
        if (index > -1) {
          this.mListModels[index].checked = true;
          this.mListChecked.push(this.mListModels[index].dornor);
        }
      }
     
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onCheckDornorSelected(dornorID: number): boolean {
    let check = false;
    for (let i = 0; i < this.mListChecked.length; i++) {
      if (this.mListChecked[i].getDornorID() == dornorID) {
        check = true;
        break;
      }
    }
    return check;
  }

  onParseDornorList(sfsArray) {
    let arryadornors = this.mAppModule.getUserManager().onResponeDornorSFSArray(sfsArray);
    if (this.nextPage == 0) {
      this.mListModels = []
    }
    arryadornors.forEach(ele => {
      this.mListModels.push({
        dornor: ele,
        checked: this.onCheckDornorSelected(ele.getDornorID())
      })
    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("DornorLeagueListPage");
  }

  clearQuery(){
    this.searchQuery = "";
  }

  onClickSearch() {
    if (this.searchQuery.trim() != '') {
      this.mAppModule.showLoading();
      this.mAppModule.getLeagueManager().sendRequestSearchDonor(this.searchQuery, this.nextPage);
    }
  }

  onClickDornor(item: ListModels){
    this.mAppModule.showLoading();
    if(item.checked){
      this.mAppModule.getLeagueManager().sendRequestRemoveDornorInLeague(item.dornor.getDornorID(),this.mLeague.getLeagueID());
    }else{
      this.mAppModule.getLeagueManager().sendRequestAddDornorInLeague(item.dornor.getDornorID(),this.mLeague.getLeagueID());
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onClickSearch();
      infiniteScroll.complete();
    }, 500);
  }

  goToCreateDonor(){
    this.mAppModule.showModalIonic("CreateDonorPage",null,(dornor)=>{
      if(dornor){
        this.mListModels.unshift({
          dornor: dornor,
          checked: false
        });
      }
    })
  }

}
