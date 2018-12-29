import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { AppManager } from '../../../providers/manager/app-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the LeagueAdminToolPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-league-admin-tool',
  templateUrl: 'league-admin-tool.html',
})
export class LeagueAdminToolPage {

  mLeague: Leagues = new Leagues();

  numberDidEnter: number = 0;

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague.setLeagueID(this.navParams.get("params"));
    }
  }

  onLoadData() {
   Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LEAGUE_INFO(this.mLeague.getLeagueID());
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onLoadData();
    }
    this.numberDidEnter++;
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("LeagueAdminToolPage", respone => {
        this.onExtensionRespone(respone);
      });

      this.onLoadData();

    });

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("LeagueAdminToolPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LEAGUE_INFO) {
      this.onResponeAPP_GET_LEAGUE_INFO(params);
    }

  }


  onResponeAPP_GET_LEAGUE_INFO(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mLeague.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

}
