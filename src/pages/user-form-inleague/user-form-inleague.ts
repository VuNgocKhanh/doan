import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../providers/classes/league';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { RecordItems } from '../../providers/classes/recorditem';
import { Player } from '../../providers/classes/player';

/**
 * Generated class for the UserFormInleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-form-inleague',
  templateUrl: 'user-form-inleague.html',
})
export class UserFormInleaguePage {

  private mLeague : Leagues = new Leagues();

  private mData: any;
  constructor(
    public mAppModule : AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillUnLoad(){
    Bd69SFSConnector.getInstance().removeListener("UserFormInleaguePage");
  }


  ionViewDidLoad() {
    this.onLoadParams();
    this.mAppModule._LoadAppConfig().then(()=>{
      Bd69SFSConnector.getInstance().addListener("UserFormInleaguePage", respone=>{
        this.onExtensionRespone(respone);
      }); 
      this.mAppModule.getLeagueManager().sendRequestGetPlayerFormInLeague(this.mLeague.getLeagueID(),this.mAppModule.getUserManager().getUser().getUserID());
    })
  }

  onLoadData(params){
    let data = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO).getUtfString(ParamsKey.DATA);
    if(data){
      this.mData = JSON.parse(data);
    }

  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if(cmd == Bd69SFSCmd.GET_PLAYER_FORM_IN_LEAGUE){
      if(params.getInt(ParamsKey.STATUS) == 1){
        this.onLoadData(params);
      }
    }
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague = this.navParams.get("params");
    }
  }

  onClickProfile(){
    /**Go to user proflie record */
    this.navCtrl.push("ProfileUserPage", {players: { leagueID: this.mLeague.getLeagueID(), playerID:  this.mAppModule.getUserManager().getUser().getUserID()}, role: 1});
  }

  onClickMemberCard(){
    let newPlayer = new Player();
    newPlayer.setPlayerID(this.mAppModule.getUserManager().getUser().getUserID());
    newPlayer.setUserID(this.mAppModule.getUserManager().getUser().getUserID());
    newPlayer.setLeagueID(this.mLeague.getLeagueID());
    this.mAppModule.showModalScale("MemberCardPage", {params: newPlayer});
  }

}
