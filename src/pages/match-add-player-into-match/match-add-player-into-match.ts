import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Match } from '../../providers/classes/matches';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Player } from '../../providers/classes/player';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';

/**
 * Generated class for the MatchAddPlayerIntoMatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface PlayerModels {
  player: Player;
  isSelect: boolean;
}

@IonicPage()
@Component({
  selector: 'page-match-add-player-into-match',
  templateUrl: 'match-add-player-into-match.html',
})
export class MatchAddPlayerIntoMatchPage {
  mMatch: Match = new Match();

  clubID: number = -1;

  mListPlayers: Array<Player> = [];

  mListPlayerModels: Array<PlayerModels> = [];

  constructor(
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();

  }

  ionViewDidLoad() {

    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("MatchAddPlayerIntoMatchPage", respone => {
        this.onExtendsionRespone(respone);
      })
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_MATCH_INFO(this.mMatch.getLeagueID(), this.mMatch.getMatchID());

    });
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("MatchAddPlayerIntoMatchPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_MATCH_INFO) {
      this.onResponeGetMatchInfo(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onResponeGetPlayerInClub(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_CLUB_IN_MATCH) {
      this.onResponeUpdateClubInMatch(params);
    }

  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.clubID = params["clubID"];
      this.mMatch.setMatchID(params["matchID"]);
      this.mMatch.setLeagueID(params["leagueID"]);
    }
  }

  onResponeUpdateClubInMatch(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          // this.mMatch.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          // let match = this.mAppModule.getMatchManager().getMatchById(this.mMatch.getMatchID());
          // if (match != null) {
          //   match.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          // }
          this.navCtrl.pop();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetMatchInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mMatch.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          let match = this.mAppModule.getMatchManager().getMatchById(this.mMatch.getMatchID());
          if (match != null) {
            match.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          }
          let home = content.getSFSObject(ParamsKey.HOME);
          let away = content.getSFSObject(ParamsKey.AWAY);
          this.mMatch.getHomeClub().fromSFSObject(home);
          this.mMatch.getAwayClub().fromSFSObject(away);
          this.onLoadPlayerInClub();
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadPlayerInClub() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER(this.mMatch.getLeagueID(), this.clubID, -1);
  }

 

  onResponeGetPlayerInClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params,clubID,leagueID);
          this.onLoadPlayerModels();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickCheckmark() {
    let arrayIDs: string = "";

    this.mListPlayerModels.forEach(model => {
      if (model.isSelect) {
        if (arrayIDs.trim() == "") {
          arrayIDs = model.player.getPlayerID() + "";
        } else {
          arrayIDs = arrayIDs.concat("-", model.player.getPlayerID() + "");
        }
      }
    });

    if (arrayIDs == "") {
      this.mAppModule.showToast("Bạn chưa chọn cầu thủ nào !");
      return;
    }

    this.mAppModule.showLoading().then(() => {
      /**send request update */
      this.mAppModule.getLeagueManager().sendRequestUpdatePlayersOfClubInMatch(this.mMatch.getMatchID(), this.mMatch.getLeagueID(), this.clubID, arrayIDs);
    });
  }

  onLoadPlayerModels() {
    this.mListPlayerModels = [];

    let arrayIDs = [];
    if (this.clubID == this.mMatch.getHomeID()) {
      arrayIDs = this.mMatch.getHomeClub().getPlayersInMatch();
    } else {
      arrayIDs = this.mMatch.getAwayClub().getPlayersInMatch();
    }

    this.mListPlayers.forEach(player => {
      let check = false;
      for (let i = 0; i < arrayIDs.length; i++) {
        if (player.getPlayerID() == arrayIDs[i]) {
          check = true;
          break;
        }
      }
      this.mListPlayerModels.push({
        player: player,
        isSelect: check
      });
    })
  }
}
