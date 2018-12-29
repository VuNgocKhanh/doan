import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Leagues } from '../../providers/classes/league';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';

/**
 * Generated class for the LeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-league',
  templateUrl: 'league.html',
})
export class LeaguePage {
  roleOfUser: number = 0;
  mLeagues : Array<Leagues> = [];
  page: number = 0;
  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.roleOfUser = this.mAppModule.getUserManager().getUser().getRole();
    Bd69SFSConnector.getInstance().addListener("LeaguePage", respone=>{
      this.onExtendsionRespone(respone);
    })

    this.mAppModule.getLeagueManager().sendRequestGetLeagueList(this.page);
  }

  ionViewWillUnload(){
    Bd69SFSConnector.getInstance().removeListener("LeaguePage");
  }

  onExtendsionRespone(respone){
    let cmd = respone.cmd;
    let params = respone.params;
    if(cmd == Bd69SFSCmd.GET_LEAGUE_LIST){
      if(params.getInt(ParamsKey.STATUS) == 1){
        this.onResponeLeague(params);
      }else{
        this.mAppModule.showParamsMessage(params);
      }
    }
  }

  onResponeLeague(params){
    ////  console.log("params league list" , params.getDump());
    this.onResponeSFSArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
  }

  onResponeSFSArray(sfsArray){
    this.mLeagues = [];
    for(let i = 0;i < sfsArray.size(); i ++){
        let sfsdata = sfsArray.getSFSObject(i);
        let newLeague = new Leagues();
        newLeague.fromSFSobject(sfsdata);
        this.mLeagues.push(newLeague);            
    }
    console.log(this.mLeagues);
    
}

  

  goToSearch(){
    this.navCtrl.push("Bd69SearchPage");
  }

  createLeague(){
    this.mAppModule.showModalIonic("SlideLeagueDetailPage",null,(data: Leagues)=>{
      if(data){
        this.onClickLeague(data);
      }
    });
  }

  onClickLeague(item: Leagues){
    this.navCtrl.push("LeagueDetailPage", {params: item.getLeagueID()});
  }

  doRefresh(refresher) {
    this.mAppModule.getLeagueManager().sendRequestGetLeagueList(0);

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
