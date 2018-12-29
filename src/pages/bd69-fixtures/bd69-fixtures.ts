import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RoleInLeague, MatchState } from '../../providers/manager/constant-manager';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Leagues } from '../../providers/classes/league';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Match } from '../../providers/classes/matches';
import { Fixtures } from '../../components/matches-result/matches-result';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the Bd69FixturesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-fixtures',
  templateUrl: 'bd69-fixtures.html',
})
export class Bd69FixturesPage {


  mMatches: Array<Match> = [];

  mListFixtures: Array<Fixtures> = [];

  mLeague: Leagues = new Leagues();

  nextPage : number = 0;

  page: number = 0;

  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague.setLeagueID(this.navParams.get("params"));
    }
  }

  onLoadData(){
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_MATCH(this.mLeague.getLeagueID(),null,-1);
  }

  ionViewDidLoad() {

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69FixturesPage", respone => {
        this.onExtendsionRespone(respone);
      });

      this.onLoadData();

    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69FixturesPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;


    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_MATCH) {
      this.onResponeGetListMatchOfLeague(params);
    } 
  }



  onResponeGetListMatchOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.onGetMatchesSuceess(params);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onGetMatchesSuceess(params) {
    let content = params.getSFSObject(ParamsKey.CONTENT);
    
    if (content && content.containsKey(ParamsKey.ARRAY)) {

      if (content.containsKey("next")) {
        this.nextPage = content.getInt("next");
      } else {
        this.nextPage = -1;
      } 

      this.page = content.getInt(ParamsKey.PAGE);

      let arrayMatches = this.mAppModule.getMatchManager().onResponeSFSArray(params);
      if(this.page < 0){
        this.mMatches = arrayMatches;
      }else{
        this.mMatches = this.mMatches.concat(arrayMatches);
      }
     
      this.onLoadArray();
    }
  }

  onLoadArray() {
   
    let mArrayDate = this.mAppModule.getMatchManager().onFindDateInArray(this.mMatches);
    this.mListFixtures = [];
    mArrayDate.forEach(element => {
      this.mListFixtures.push({
        date: element,
        matches: this.mAppModule.getMatchManager().getMatchesByDate(element, this.mMatches)
      });
    });
    
  }

  onClickMatch(params: { match: Match, id: number }) {
    let match = params.match;
    let id = params.id;
    this.navCtrl.push("MatchInfoPage", { params: { leagueID: match.getLeagueID(), matchID: match.getMatchID() } });
  }
 

  doRefresh(refresher) {
    setTimeout(() => {
      this.mAppModule.getLeagueManager().sendRequestGetListMatchOfLeague(this.mLeague.getLeagueID(),null,0);
      refresher.complete();
    }, 2000);
  }

 

  doInfinite(infiniteScroll) {
   
    setTimeout(() => {
      this.onLoadData();
      infiniteScroll.complete();
    }, 500);
  }


}
