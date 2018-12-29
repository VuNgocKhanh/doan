import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Rule } from '../../../providers/classes/rule';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the Bd69RuleOfLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-rule-of-league',
  templateUrl: 'bd69-rule-of-league.html',
})
export class Bd69RuleOfLeaguePage {

  mRule: Rule = new Rule();

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mRule.setLeagueID(this.navParams.get("params"));
    }
  }

  onLoadData() {
    if (this.mRule.getLeagueID() > -1) {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LEAGUE_RULE(this.mRule.getLeagueID());
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69RuleOfLeaguePage", respone => {
        this.onExtensionRespone(respone);
      });
    });

    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69RuleOfLeaguePage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LEAGUE_RULE) {
      this.onRuleOfLeagueParams(params);
    } else if(cmd == Bd69SFSCmd.LEAGUE_UPDATE_LEAGUE_RULE){
      this.onResponeUpdateLeagueRule(params);
    }
  }

  onRuleOfLeagueParams(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mRule.fromSFSObject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateLeagueRule(params){
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Cập nhật luật thi đấu thành công");
      this.onRuleOfLeagueParams(params);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickCheckmark() {
    this.mAppModule.showLoading().then(() => {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_LEAGUE_RULE(this.mRule.getLeagueID(), this.mRule);
    });
  }

}
