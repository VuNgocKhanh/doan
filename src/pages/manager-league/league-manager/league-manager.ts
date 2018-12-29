import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Leagues } from '../../../providers/classes/league';
import { RoleInLeague } from '../../../providers/manager/constant-manager';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { User } from '../../../providers/classes/user';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Utils } from '../../../providers/core/app/utils';
import { AppManager } from '../../../providers/manager/app-manager';

export interface LeagueManager {
  id: number;
  icon: string;
  name: string;
  page: string;
  params?: any;
  color: string;
  title?: string;
}

@IonicPage()
@Component({
  selector: 'page-league-manager',
  templateUrl: 'league-manager.html',
})
export class LeagueManagerPage {

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  leagueID: number = -1;

  mUser: User;

  mListLeagues: Array<Leagues> = [];

  mListLeaguesFillter: Array<Leagues> = [];

  numberDidEnter: number = 0;

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.mUser = this.mAppModule.getUserManager().getUser();
  }

  ionViewDidEnter() {
    // if(this.numberDidEnter > 0){
    //   this.onLoadData();
    // }
    // this.numberDidEnter++;
    if (this.numberDidEnter == 1) {
      this.onLoadData();
    }
  }

  onLoadData() {
    AppManager.getInstance().sendRequestAPP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN();
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("LeagueManagerPage", respone => {
        this.onExtensionRespone(respone);
      });
      this.onLoadData();
    });

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("LeagueManagerPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN) {
      this.onParseListLeagueOfUserParams(params);
    }
  }

  onParseListLeagueOfUserParams(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListLeagues = [];
          this.mAppModule.getLeagueManager().onResponeSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          this.mListLeagues = this.mAppModule.getLeagueManager().getLeagues();
          this.mListLeaguesFillter = this.mListLeagues;
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickLeague(league: Leagues) {
    this.numberDidEnter = 1;
    this.navCtrl.push("LeagueAdminToolPage", { params: league.getLeagueID() });
  }

  onClickLeagueName(league: Leagues) {
    this.numberDidEnter = 1;
    this.navCtrl.push("LeagueAdminToolPage", { params: league.getLeagueID() });
  }


  onClickMenu() {
    this.numberDidEnter = 1;
    this.navCtrl.push("TabsPage", { userID: this.mUser.getUserID() });
  }

  goToUserProfile() {
    this.navCtrl.setRoot("TabsPage");
  }

  doSearchLeague() {
    if (this.searchQuery.trim() != "") {
      this.mListLeaguesFillter = this.mListLeagues.filter(league => {
        return Utils.bodauTiengViet(league.getName()).toLowerCase().includes(Utils.bodauTiengViet(this.searchQuery).toLowerCase()) || this.searchQuery == league.getName();
      });

    } else {
      this.mListLeaguesFillter = this.mListLeagues;
    }
  }
}
