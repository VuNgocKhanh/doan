import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Player } from '../../providers/classes/player';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';

/**
 * Generated class for the PlayerInfoInClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player-info-in-club',
  templateUrl: 'player-info-in-club.html',
})
export class PlayerInfoInClubPage {

  mPlayer: Player = new Player();

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      if (params["playerID"]) {
        this.mPlayer.setPlayerID(params["playerID"]);
      }
      if (params["clubID"]) {
        this.mPlayer.setClubID(params["clubID"]);
        this.mPlayer.setClubName(this.mAppModule.getClubManager().getClubByID(this.mPlayer.getClubID()).getName());
      }
    }
  }

  ionViewDidLoad() {
    this.mAppModule.addBd69SFSResponeListener("PlayerInfoInClubPage", respone => {
      this.onExtendsionRespone(respone);
    })
    this.mAppModule.getUserManager().sendRequestGetPlayerInClubInfo(this.mPlayer.getPlayerID(),this.mPlayer.getClubID());
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("PlayerInfoInClubPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_PLAYER_IN_CLUB_INFO) {
      this.onResponeGetPlayerInClubInfo(params);
    }
  }

  onResponeGetPlayerInClubInfo(params) {
    if(params.getInt(ParamsKey.STATUS) == 1){
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        if(content.containsKey(ParamsKey.INFO)){
          this.mPlayer.onResponeSFSObject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }

}
