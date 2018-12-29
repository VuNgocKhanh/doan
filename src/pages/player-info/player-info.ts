import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Player } from '../../providers/classes/player';
import { User } from '../../providers/classes/user';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ConstantManager, RoleInClub } from '../../providers/manager/constant-manager';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { PlayerRecordInLeague } from '../../providers/classes/player_record_inleague';

/**
 * Generated class for the PlayerInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player-info',
  templateUrl: 'player-info.html',
})
export class PlayerInfoPage {


  mPlayer: Player = new Player();

  clubName: string = "";

  mPlayerRecordInLeague: PlayerRecordInLeague = new PlayerRecordInLeague();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  ionViewDidLoad() {
    this.mAppModule.addBd69SFSResponeListener("PlayerInfoPage", respone => {
      this.onExtendsionRespone(respone);
    })
    if(this.mPlayer.getPlayerID() > -1 && this.mPlayer.getLeagueID() > -1 && this.mPlayer.getClubID() > -1){
      this.mAppModule.getLeagueManager().sendRequestGET_PLAYER_IN_LEAGUE_INFO(this.mPlayer.getPlayerID(),this.mPlayer.getClubID(),this.mPlayer.getLeagueID());
    }else{
      this.mAppModule.showToast("Không thể lấy thông tin cầu thủ");
      this.navCtrl.pop();
    }
  }
  onLoadParams() {
    if(this.navParams.data["params"]){
      let params = this.navParams.get("params");
      if(params["playerID"]){
        this.mPlayer.setPlayerID(params["playerID"]);
      }
      if(params["leagueID"]){
        this.mPlayer.setLeagueID(params["leagueID"]);
      }
      if(params["clubID"]){
        this.mPlayer.setClubID(params["clubID"]);
      }
    }
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("PlayerInfoPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if(cmd == Bd69SFSCmd.GET_PLAYER_IN_LEAGUE_INFO){
      this.onResponeGetPlayerInLeagueInfo(params);
    }
  }

  onResponeGetPlayerInLeagueInfo(params){
    if(params.getInt(ParamsKey.STATUS) == 1){
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        if(content.containsKey(ParamsKey.INFO)){
          this.mPlayer.onResponeSFSObject(content.getSFSObject(ParamsKey.INFO));
        }

        if(content.containsKey(ParamsKey.DATA)){
          this.mPlayerRecordInLeague.fromSFSobject(content.getSFSObject(ParamsKey.DATA));        
        }
        this.mPlayer.onParsePlayerRecordInLeague(this.mPlayerRecordInLeague);
      }
    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }
}
