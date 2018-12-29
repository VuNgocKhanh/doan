import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Match } from '../../providers/classes/matches';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Stadium } from '../../providers/classes/stadium';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the MatchUpdateResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match-update-result',
  templateUrl: 'match-update-result.html',
})
export class MatchUpdateResultPage {

  mMatch: Match = new Match();

  isUpdateHomeGoal: number = -1;

  mStadium: Stadium = new Stadium();

  constructor(
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("MatchUpdateResultPage", respone => {
        this.onExtendsionRespone(respone);
      })

      Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_MATCH_INFO(this.mMatch.getLeagueID(),this.mMatch.getMatchID());
    })
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_MATCH_INFO) {
      this.onResponeMatchInfo(params);
    }  else if (cmd == Bd69SFSCmd.UPDATE_MATCH_RESULT) {
      this.onResponeUpdateMatchResult(params);
    }
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("MatchUpdateResultPage");
  }

  onClickCheckmark() {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getMatchManager().sendRequestUPDATE_MATCH_RESULT(this.mMatch);
    })
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mMatch.setMatchID(params["matchID"]);
      this.mMatch.setLeagueID(params["leagueID"]);
    }
  }


  onResponeMatchInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.getSFSObject(ParamsKey.INFO)) {
          this.mMatch.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          let home = content.getSFSObject(ParamsKey.HOME);
          let away = content.getSFSObject(ParamsKey.AWAY);
          this.mMatch.getHomeClub().fromSFSObject(home);
          this.mMatch.getAwayClub().fromSFSObject(away);
          this.mMatch.setHomeGoal(this.mMatch.getHomeClub().getGoal());
          this.mMatch.setAwayGoal(this.mMatch.getAwayClub().getGoal());
          let stadium = content.getSFSObject(ParamsKey.STADIUM);
          this.mStadium.fromSFSobject(stadium);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateMatchResult(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.navCtrl.pop();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }
}
