import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { TopCardInLeague } from '../../providers/classes/top-card-in-league';

/**
 * Generated class for the TopCardInLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-card-in-league',
  templateUrl: 'top-card-in-league.html',
})
export class TopCardInLeaguePage {
  leagueID: number;

  nextPage: number = 0;

  page; number = 0;

  count: number = 1;

  mCardList: Array<TopCardInLeague> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider) {
  }

  ionViewDidLoad() {
    this.onLoadParams();
    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("TopCardInLeaguePage", response => {
        this.onExtensionResponse(response);
      });

      this.mAppModule.getUserManager().sendRequestGetTopCardInLeague(this.leagueID, this.nextPage);
    })
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("TopCardInLeaguePage");
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.leagueID = this.navParams.get("params");
    }
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.GET_TOP_CARD_OF_LEAGUE) {
      this.onResponseGET_TOP_CARD_OF_LEAGUE(params);

    }
  }

  onResponseGET_TOP_CARD_OF_LEAGUE(params) {
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
        let cardList: Array<TopCardInLeague> = [];
        for (let i = 0; i < sfsArray.size(); i++) {
          let sfsdata = sfsArray.getSFSObject(i);
          let topGoalInLeague = new TopCardInLeague();
          topGoalInLeague.onResponeSFSObject(sfsdata);
          cardList.push(topGoalInLeague);
        }
        if (this.page < 1) {
          this.mCardList = cardList;
        } else {
          this.mCardList = this.mCardList.concat(cardList);
        }
      }
    }
  }

  onScroll() {
    this.mAppModule.getUserManager().sendRequestGetTopCardInLeague(this.leagueID, this.nextPage);
  }

  onClickItem(card: TopCardInLeague) {
    this.navCtrl.push("PlayerInfoPage", { params: { playerID: card.getPlayerID(), clubID: card.getClubID(), leagueID: card.getLeagueID() } })
  }

  onClickPlayerInfo(goal: TopCardInLeague) {
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
      this.mAppModule.getUserManager().sendRequestGetTopCardInLeague(this.leagueID, this.nextPage);
      refresher.complete();
    }, 2000);
  }

}
