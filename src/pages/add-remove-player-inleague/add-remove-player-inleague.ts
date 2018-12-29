import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { Player } from '../../providers/classes/player';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Clubs } from '../../providers/classes/clubs';

/**
 * Generated class for the AddRemovePlayerInleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface PlayerModels {
  player: Player;
  checked: boolean;
}

@IonicPage()
@Component({
  selector: 'page-add-remove-player-inleague',
  templateUrl: 'add-remove-player-inleague.html',
})
export class AddRemovePlayerInleaguePage {

  mListPlayerChecked: Array<Player> = [];

  mListPlayerModels: Array<PlayerModels> = [];

  clubID: number = -1;

  leagueID: number = -1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.onLoadParams();

    Bd69SFSConnector.getInstance().addListener("AddRemovePlayerInleaguePage", response => {
      this.onExtensionResponse(response);
    });

    this.mAppModule.getClubManager().sendRequestGetPlayerInClub(this.clubID);


  }
  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("AddRemovePlayerInleaguePage");
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.clubID = params["clubID"];
      this.leagueID = params["leagueID"];
      this.mListPlayerChecked = params["listAdded"];
      
    }
  }

  onCheckedPlayer(playerID: number) {
    let check = false;
    for (let i = 0; i < this.mListPlayerChecked.length; i++) {
      if (this.mListPlayerChecked[i].getPlayerID() == playerID) {
        check = true;
        break;
      }
    }
    return check;
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.GET_USER_IN_CLUB) {
      this.onResponeSFSArrayPlayer(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
    }

    if(cmd == Bd69SFSCmd.REMOVE_PLAYER_FROM_LEAGUE){
      if(params.getInt(ParamsKey.STATUS) == 1){
        let playerID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayerModels.findIndex(item=>{
          return item.player.getPlayerID() == playerID;
        })
        if(index > -1){
          this.mListPlayerModels[index].checked = false;
        }
      }
      this.mAppModule.hideLoading();
    }

    if(cmd == Bd69SFSCmd.ADD_PLAYER_INTO_LEAGUE){
      if(params.getInt(ParamsKey.STATUS) == 1){
        let playerID = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO).getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayerModels.findIndex(item=>{
          return item.player.getPlayerID() == playerID;
        })
        if(index > -1){
          this.mListPlayerModels[index].checked = true;
        }
      }
      this.mAppModule.hideLoading();

    }
    
  }

  onResponeSFSArrayPlayer(sfsArray) {
    if (sfsArray) {
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsdata = sfsArray.getSFSObject(i);
        let newPlayer = new Player();

        newPlayer.onResponeSFSObject(sfsdata);
        newPlayer.fromSFSObject(sfsdata);

        this.mListPlayerModels.push({
          player: newPlayer,
          checked: this.onCheckedPlayer(newPlayer.getPlayerID())
        })
        
      }
    }
  }

  onClickButtonEnd(item: PlayerModels){
    this.mAppModule.showLoading();
    if(item.checked){
      this.mAppModule.getLeagueManager().removePlayerFromLeague(this.leagueID,this.clubID,item.player.getPlayerID());
    }else{
      this.mAppModule.getLeagueManager().addPlayerIntoLeague(this.leagueID,this.clubID,item.player.getPlayerID());
    }
  }

  

}
