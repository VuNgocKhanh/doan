import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerLeagueTablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-league-table',
  templateUrl: 'manager-league-table.html',
})
export class ManagerLeagueTablePage {

  mListClubInLeagues: Array<ClubInLeague> = [];

  mLeague: Leagues = new Leagues();

  isLoadingData: boolean = true;

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
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_TABLE(this.mLeague.getLeagueID());
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onLoadData();
    }
    this.numberDidEnter++;
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerLeagueTablePage", respone => {
        this.onExtendsionRespone(respone);
      });

      this.onLoadData();
    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerLeagueTablePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if(cmd == Bd69SFSCmd.LEAGUE_GET_LEAGUE_INFO){
      this.onResponeLeagueInfo(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_TABLE) {
      this.onParseClubInLeague(params);
    }
  }

  onResponeLeagueInfo(params){
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

  onParseClubInLeague(params) {
    this.isLoadingData = false;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListClubInLeagues = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onClickClub(club: ClubInLeague){
    this.navCtrl.push("ManagerLeagueTableEditPage", {params: {leagueID: this.mLeague.getLeagueID(), clubID: club.getClubID()}});
  }


}
