import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerLeagueEditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-league-edit-profile',
  templateUrl: 'manager-league-edit-profile.html',
})
export class ManagerLeagueEditProfilePage {

  mListClubs: Array<ClubInLeague> = [];

  numberDidEnter: number = 0;

  mLeagueID: number = -1;

  isLoadingData: boolean = true;

  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onLoadData(){
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_CLUB(this.mLeagueID);
  }

  ionViewDidEnter(){
    if(this.numberDidEnter > 0){
      this.onLoadData();
    }
    this.numberDidEnter++;
  }


  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.mAppModule.onSwithToLoading();
      return;
    }
    
    this.mAppModule._LoadAppConfig().then(()=>{
      Bd69SFSConnector.getInstance().addListener("ManagerLeagueEditProfilePage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
    })
   
  }

  ionViewWillUnload(){
    this.mAppModule.removeSFSListener("ManagerLeagueEditProfilePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_CLUB) {
      this.onParseClubInLeague(params);
    }

  }

  onParseClubInLeague(params) {
    this.isLoadingData = false;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if(content.containsKey(ParamsKey.ARRAY)){
          this.mListClubs = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  goToProfileClub(item: ClubInLeague) {
    this.navCtrl.push("Bd69ClubinleagueDetailPage", { params: { leagueID: this.mLeagueID, clubID: item.getClubID(), type: 1 } });
  }

  doRefresh(refresher) {
    
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }
 

}
