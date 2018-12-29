import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../../providers/smartfox/bd69-sfs-connector';
import { Match } from '../../../../providers/classes/matches';
import { Bd69SFSCmd } from '../../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../../providers/classes/paramkeys';
import { Stadium } from '../../../../providers/classes/stadium';
import { MatchState } from '../../../../providers/manager/constant-manager';

/**
 * Generated class for the ConfirmMatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-match',
  templateUrl: 'confirm-match.html',
})
export class ConfirmMatchPage {

  mLeagueID: number = -1;

  mClubID: number = -1;

  mListMatch: Array<Match> = [];

  mListStadium: Array<Stadium> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      console.log(this.navParams.get("params"));
      
      let params = this.navParams.get("params");
      this.mLeagueID = params['leagueID'];
      this.mClubID = params['clubID'];
    }
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_STATIDUM(this.mLeagueID,-1);
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_MATCH(this.mLeagueID, this.mClubID, 0);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ConfirmMatchPage", respone => {
        this.onExtensionResponse(respone);
      })
      this.onLoadData();
    });
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ConfirmMatchPage");
  }

  onExtensionResponse(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if(cmd == Bd69SFSCmd.LEAGUE_GET_LIST_STATIDUM){
      this.onResponeListStadium(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_MATCH) {
      this.onResponeListMatch(params);
    }

  }

  onResponeListStadium(params) {
    if(params.getInt(ParamsKey.STATUS) == 1){
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if(content){
        if(content.containsKey(ParamsKey.ARRAY)){
          this.mListStadium = this.mAppModule.getLeagueManager().onParseStadiumList(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeListMatch(params){
    if(params.getInt(ParamsKey.STATUS) == 1){
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if(content){
        if(content.containsKey(ParamsKey.ARRAY)){
          this.mListMatch = this.mAppModule.getMatchManager().onResponeSFSArray(params);
          this.mListMatch.forEach(match=>{
            match.setStadium(this.mAppModule.getLeagueManager().getStadiumByID(match.getStadiumID()));
          });
        }
      }
    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickMatch(match : Match){
    if(match.getState() == MatchState.FINISHED){
      this.navCtrl.push("ManagerLeagueRecordMatchPage", {params:{ leagueID: this.mLeagueID, clubID: this.mClubID, matchID: match.getMatchID(), mode: 2}});
    }
  }

}
