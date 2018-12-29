import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { TopGoalInLeague } from '../../providers/classes/top-goal-in-league';
import { Player } from '../../providers/classes/player';



@IonicPage()
@Component({
  selector: 'page-top-goal-in-league',
  templateUrl: 'top-goal-in-league.html',
})
export class TopGoalInLeaguePage {

  leagueID: number;

  nextPage: number = 0;

  page: number = 0;

  count: number = 1;

  goalList: Array<TopGoalInLeague> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.onLoadParams();
    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("TopGoalInLeaguePage", response => {
        this.onExtensionResponse(response);
      });

      this.mAppModule.getUserManager().sendRequestGetTopGoalInLeague(this.leagueID, this.nextPage);
    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("TopGoalInLeaguePage");
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.leagueID = this.navParams.get("params");
    }
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.GET_TOP_GOAL_OF_LEAGUE) {
      this.onResponseGET_TOP_GOAL_OF_LEAGUE(params);

    }
  }

  onResponseGET_TOP_GOAL_OF_LEAGUE(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content.containsKey(ParamsKey.NEXT)) {
        this.nextPage = content.getInt(ParamsKey.NEXT);
      } 
      if (content.containsKey(ParamsKey.PAGE)) {
        this.page = content.getInt(ParamsKey.PAGE);
      }

      if (content) {
        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        let goalList: Array<TopGoalInLeague> = [];
        for (let i = 0; i < sfsArray.size(); i++) {
          let sfsdata = sfsArray.getSFSObject(i);
          let topGoalInLeague = new TopGoalInLeague();
          topGoalInLeague.onResponeSFSObject(sfsdata);
          goalList.push(topGoalInLeague);
        }
        if (this.page < 1) {
          this.goalList = goalList;
        } else {
          this.goalList = this.goalList.concat(goalList);
        }
      }
    }
  }

  onScroll() {
    this.mAppModule.getUserManager().sendRequestGetTopGoalInLeague(this.leagueID, this.nextPage);
  }

  onClickPlayerInfo(goal: TopGoalInLeague) {
    this.navCtrl.push("PlayerInfoPage", { params: { playerID: goal.getPlayerID(), clubID: goal.getClubID(), leagueID: goal.getLeagueID() } });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onScroll();
      infiniteScroll.complete();
    }, 500);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.nextPage = 0;
      this.mAppModule.getUserManager().sendRequestGetTopGoalInLeague(this.leagueID, this.nextPage);
      refresher.complete();
    }, 2000);
  }
}
