import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../providers/classes/league';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Clubs } from '../../providers/classes/clubs';

/**
 * Generated class for the LeagueClubJoinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-league-club-join',
  templateUrl: 'league-club-join.html',
})
export class LeagueClubJoinPage {

  title = "Giải đấu tham gia";
  attend = "Tham gia";
  request = "Gửi yêu cầu";
  
  cancel = "Hủy yêu cầu"

  listLeagueJoin: Array<Leagues> = [];
  
  listLeagurAttend: Array<Leagues> = [];

  clubID: number = -1;

  isChoose: number = 1;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.onLoadParams();
    Bd69SFSConnector.getInstance().addListener("LeagueClubJoinPage", response => {
      this.onExtensionRespone(response);
    });
    this.mAppModule.getUserManager().getListLeagueOfClub(this.clubID);
    this.mAppModule.getUserManager().getRequestJoinLeagueOfClub(1, this.clubID);
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("LeagueClubJoinPage");
  }

  onLoadParams() {
    if (this.navParams.get("params")) {
      this.clubID = this.navParams.get("params");
    }
  }

  onExtensionRespone(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.GET_LIST_LEAGUE_OF_CLUB) {
      if(params.getInt(ParamsKey.STATUS) == 1){
        let content = params.getSFSObject(ParamsKey.CONTENT);
        if(content.containsKey(ParamsKey.ARRAY)){
          this.onResponseSFSArrayInLeague(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
      this.mAppModule.hideLoading();
    } else if (cmd == Bd69SFSCmd.GET_REQUEST_JOIN_LEAGUE_OF_CLUB) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        if (content.containsKey("requests")) {
          this.onResponseSFSArrayJoinLeague(content.getSFSArray("requests"));
        }
      }
      this.mAppModule.hideLoading();
    } else if (cmd == Bd69SFSCmd.REMOVE_REQUEST_JOIN_LEAGUE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.mAppModule.getUserManager().getRequestJoinLeagueOfClub(1, this.clubID);
      }
    }
  }

  onResponseSFSArrayInLeague(sfsArray){
    if(sfsArray){
      this.listLeagurAttend = [];
      for(let i = 0; i < sfsArray.size(); i++){
        let sfsObject = sfsArray.getSFSObject(i);
        let newLeague = new Leagues();
        newLeague.fromSFSobject(sfsObject);
        this.listLeagurAttend.push(newLeague);

      }
    }
  }

  onResponseSFSArrayJoinLeague(sfsArray) {
    if (sfsArray) {
      this.listLeagueJoin = [];
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsObject = sfsArray.getSFSObject(i);
        let newLeague = new Leagues();
        newLeague.fromSFSobject(sfsObject);

        this.listLeagueJoin.push(newLeague);

      }
    }
  }

  onClickCancelRequestJoinClub(leagueID: number) {
    this.mAppModule.showLoading();
    this.mAppModule.getUserManager().sendRequestRemoveRequestJoinLeague(leagueID, this.clubID);
  }

  onClickJoin() {
    this.isChoose = 1;
  }

  onClickRequest() {
    this.isChoose = 2;
  }

  doRefresh(refresher) {
    this.mAppModule.getUserManager().getListLeagueOfClub(this.clubID);
    this.mAppModule.getUserManager().getRequestJoinLeagueOfClub(1, this.clubID);
    setTimeout(() => {

      refresher.complete();
    }, 2000);
  }

  onClickLeague(league: Leagues){
    this.navCtrl.push("LeagueDetailPage",{params: league.getLeagueID()});
  }
}
