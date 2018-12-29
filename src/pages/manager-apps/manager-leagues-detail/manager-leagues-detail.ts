import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { AppManager } from '../../../providers/manager/app-manager';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerLeaguesDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-leagues-detail',
  templateUrl: 'manager-leagues-detail.html',
})
export class ManagerLeaguesDetailPage {

  mLeague: Leagues = new Leagues();

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams(){
    if(this.navParams.data["leagueID"]){
      this.mLeague.setLeagueID(this.navParams.get("leagueID"));
      let league = this.mAppModule.getLeagueManager().getLeagueByID(this.mLeague.getLeagueID());
      if(league){
        this.mLeague.fromObject(league);
      }
    }
  }

  onLoadData(){
    AppManager.getInstance().sendRequestAPP_GET_LEAGUE_INFO(this.mLeague.getLeagueID());
    this.mAppModule.getLeagueManager().sendRequestGetListStadiumInLeague(this.mLeague.getLeagueID());
  }

  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerLeaguesDetailPage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerLeaguesDetailPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LEAGUE_INFO) {
      this.onParseLeagueInfoParams(params);
    } else if(cmd == Bd69SFSCmd.GET_LIST_STADIUM_IN_LEAGUE){
      this.onParseStadiumList(params);
    }
  }

  onParseLeagueInfoParams(params){
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

  onParseStadiumList(params){
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mAppModule.getLeagueManager().onParseStadiumList(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

}
