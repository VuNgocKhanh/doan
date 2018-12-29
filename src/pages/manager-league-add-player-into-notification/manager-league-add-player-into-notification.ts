import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Player } from '../../providers/classes/player';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerLeagueAddPlayerIntoNotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface PlayerModels{
  player: Player;
  isSelect: boolean;
}
@IonicPage()
@Component({
  selector: 'page-manager-league-add-player-into-notification',
  templateUrl: 'manager-league-add-player-into-notification.html',
})
export class ManagerLeagueAddPlayerIntoNotificationPage {

  mLeagueID: number = -1;

  mListPlayers: Array<Player> = [];

  mListPlayerModels: Array<PlayerModels> = [];

  page: number = 0;

  nextPage: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";


  constructor(
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
    }

    if(this.navParams.data["players"]){
      this.mListPlayers = this.navParams.get("players");
    }
  }


  onLoadData(){
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_PLAYER(this.mLeagueID, null, this.nextPage);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerLeagueAddPlayerIntoNotificationPage", respone => {
        this.onExtendsionRespone(respone);
      });
      this.onLoadData();
    });
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerLeagueAddPlayerIntoNotificationPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onResponeGetListPlayer(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_PLAYER) {
      this.mAppModule.hideLoading();
      this.onResponeGetListPlayer(params);
    }
  }

  onResponeGetListPlayer(params){
    
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content) {

        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);

        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params, clubID, leagueID);
          this.onParsePlayerModels(arrayPlayers);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParsePlayerModels(arrayPlayers: Array<Player>){
    if(this.page < 1){
      this.mListPlayerModels = [];
    }
    arrayPlayers.forEach(player=>{
      this.mListPlayerModels.push({
        player: player,
        isSelect: this.onCheckPlayerIsSelect(player.getPlayerID())
      });
    })
  }

  onCheckPlayerIsSelect(playerID: number): boolean{
    if(this.mListPlayers.length == 0)return false;
    for(let player of this.mListPlayers){
      if(player.getPlayerID() == playerID){
        return true;
      }
    }
    return false;
  }


  search(infinite?: boolean) {
    if (this.searchQuery.trim() != '') {
      if (this.searchQuery != this.oldSearchQuery) {
        this.oldSearchQuery = this.searchQuery;
        this.nextPage = 0;
        this.page = 0;
      }

      if (this.nextPage == -1) {
        return;
      }

      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID, this.searchQuery, this.nextPage);
        });
      } else {
        this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_PLAYER(this.mLeagueID, this.searchQuery, this.nextPage);
      }
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != '') {
        this.search();
      } else {
        this.onLoadData();
      }
      infiniteScroll.complete();
    }, 500);
  }

  onChangeSelect(event,mode: PlayerModels){
    
    let indexPlayer = this.mListPlayers.findIndex(player=>{
      return player.getPlayerID() == mode.player.getPlayerID();
    })
    
    if(mode.isSelect === true){
      if(this.mListPlayers.length == 0){
        this.mListPlayers.push(mode.player);
      }else{
        if(indexPlayer == -1){
          this.mListPlayers.push(mode.player);
        }
      }
    }else{
      if(indexPlayer > -1){
        this.mListPlayers.splice(indexPlayer,1);
      }
    }
  }


  onClickCheckMark(){
    this.mViewController.dismiss(this.mListPlayers);
  }
}
