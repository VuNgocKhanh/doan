import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { User } from '../../../providers/classes/user';
import { Leagues } from '../../../providers/classes/league';

/**
 * Generated class for the Bd69AddLeaguemangerIntoLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface ListUserModels{
  user: User;
  isChecked: boolean;
}

@IonicPage()
@Component({
  selector: 'page-bd69-add-leaguemanger-into-league',
  templateUrl: 'bd69-add-leaguemanger-into-league.html',
})
export class Bd69AddLeaguemangerIntoLeaguePage {
  searchQuery: string = "";
  constructor(
    private mViewController: ViewController,
    private mAppModuel: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  mListLeagueManager : Array<User> = [];

  mListModels: Array<ListUserModels> = []

  nextPage: number = 0;

  mLeague: Leagues = new Leagues();

  ionViewDidLoad() {
    this.mAppModuel._LoadAppConfig().then(()=>{
      this.mAppModuel.addBd69SFSResponeListener("Bd69AddLeaguemangerIntoLeaguePage",(respone)=>{
        this.onExtensionResponse(respone);
      })
      this.onLoadParams();
      this.mAppModuel.getLeagueManager().sendRequestGetListLeagueMangagerInLeague(this.mLeague.getLeagueID());
    })
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mListLeagueManager = params["listmanager"];
      this.mLeague = params["league"];
      
    }
  }

  ionViewWillUnload(){
    this.mAppModuel.removeSFSListener("Bd69AddLeaguemangerIntoLeaguePage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if(cmd == Bd69SFSCmd.SEARCH_USER){
      if(params.getInt(ParamsKey.STATUS) == 1){
        this.onResponeSFSLeagueArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
      }
    }

    if(cmd == Bd69SFSCmd.ADD_MANAGER_INTO_LEAGUE){
      if(params.getInt(ParamsKey.STATUS) == 1){
        let userID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.USER_ID);
        let index = this.mListModels.findIndex(el=>{
          return el.user.getUserID() == userID;
        })
        if(index > -1){
          this.mListModels[index].isChecked = true;
          this.mListLeagueManager.push(this.mListModels[index].user);
        }
      }
    }

    if(cmd == Bd69SFSCmd.REMOVE_MANAGER_FROM_LEAGUE){
      if(params.getInt(ParamsKey.STATUS) == 1){
        let userID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.USER_ID);
        let index = this.mListModels.findIndex(el=>{
          return el.user.getUserID() == userID;
        })
        if(index > -1){
          this.mListModels[index].isChecked = false;
        }
        let userIndex = this.mListLeagueManager.findIndex(ele=>{
          return ele.getUserID() == userID;
        })
        if(userIndex > -1){
          this.mListLeagueManager.splice(userIndex,1);
        }
      }
    }

    this.mAppModuel.hideLoading();
  }

  onResponeSFSLeagueArray(sfsArray){
    if(sfsArray){
      let userarray = this.mAppModuel.getUserManager().onResponeUserSFSArray(sfsArray);
      if(this.nextPage == 0){
        this.mListModels = [];
      }
      userarray.forEach(user=>{
        this.mListModels.push({
          user: user,
          isChecked: this.onCheckUserIsManager(user.getUserID())
        });
      })
    }
  }

  onCheckUserIsManager(userID: number): boolean{
    let check = false;
    for(let i = 0; i < this.mListLeagueManager.length; i ++){
      if(this.mListLeagueManager[i].getUserID() == userID){
        check = true;
        break;
      }
    }
    return check;
  }



  onClickSearch(){
    this.mAppModuel.getUserManager().sendRequestSearchUser(this.searchQuery,this.nextPage);
  }

  onClickUser(item: ListUserModels){
    this.mAppModuel.showLoading();
    if(item.isChecked){
      /**huy lam quan li */
      this.mAppModuel.getLeagueManager().sendRequestRemoveLeagueManagerIntoLeague(item.user.getUserID(),this.mLeague.getLeagueID());
    }else{
      /**chon lam quan li*/
      this.mAppModuel.getLeagueManager().sendRequestAddLeagueManagerIntoLeague(item.user.getUserID(),this.mLeague.getLeagueID());
    }
  }

  doInfinite(infiniteScroll) {

    setTimeout(() => {
      this.onClickSearch();
      infiniteScroll.complete();
    }, 500);
  }
  
}
