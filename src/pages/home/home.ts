import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Match } from '../../providers/classes/matches';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mMatch: Match = new Match();

  mListMatch: Array<Match> = [];

  page: number = 0;
  
  nextPage: number = 0 ;

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParam: NavParams) {
  }

  goToSearch(){
    this.navCtrl.push("Bd69SearchPage");
  }

  onLoadData(){
    Bd69SFSConnector.getInstance().sendRequestGET_LIST_MATCH_FEED(this.nextPage);
  }

  ionViewDidLoad(){
    if(!this.mAppModule.isLogin){
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(()=>{
      this.mAppModule.addBd69SFSResponeListener("HomePage", respone=>{
        this.onExtensionRespone(respone);
      });

      this.onLoadData();
    });
  }

  ionViewWillUnload(){
    this.mAppModule.removeSFSListener("HomePage");
  }

  onExtensionRespone(respone){
    let cmd = respone.cmd;
    let params = respone.params;

    if(cmd == Bd69SFSCmd.GET_LIST_MATCH_FEED){
      this.onResponeGetListMatchFeed(params);
    }
  }

  onResponeGetListMatchFeed(params){
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        if(content.containsKey(ParamsKey.NEXT)){
          this.nextPage = content.getInt(ParamsKey.NEXT);
        }else{
          this.nextPage = -1;
        }

        this.page = content.getInt(ParamsKey.PAGE);

        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayMatchs = this.mAppModule.getMatchManager().onResponeSFSArray(params);

          if(this.page  < 1){
            this.mListMatch = arrayMatchs;
          }else{
            this.mListMatch = this.mListMatch.concat(arrayMatchs);
          }

          // console.log("arraymatchs", this.mListMatch);
          
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.nextPage = 0;
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onLoadData();
      infiniteScroll.complete();
    }, 1000);
  }

  onClickMatch(match: Match){
    this.navCtrl.push("MatchInfoPage",{params: {matchID: match.getMatchID(), leagueID: match.getLeagueID()}});
  }
}
