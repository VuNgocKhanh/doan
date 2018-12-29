import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Clubs } from '../../../providers/classes/clubs';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { LeagueManager } from '../../../providers/manager/league-manager';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { ClubInLeague } from '../../../providers/classes/clubinleague';

/**
 * Generated class for the ManagerAdminsClubDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ClubOptions{
  id: number;
  name: string;
  icon: string;
  page: string;
  color: string;
}

@IonicPage()
@Component({
  selector: 'page-manager-admins-club-detail',
  templateUrl: 'manager-admins-club-detail.html',
})
export class ManagerAdminsClubDetailPage {

  mClub: Clubs = new Clubs();

  mLeagueID: number = -1;

  isLoadData: boolean = true;

  mListOptions: Array<ClubOptions> = [];

  leagueName : string = "";

  isDidEnter: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
    this.onLoadOptions();
  }

  onLoadOptions(){
    this.mListOptions = [
      {id: 1, name: "Thành viên", icon: "bd69-group", page: "AddMemberIntoClubPage",color: "green-color"},
      {id: 2, name: "Hồ sơ giải đấu", icon: "bd69-trophy", page: "ConfirmProfilePage",color: "red-color"},
      {id: 3, name: "Biên bản trận đấu", icon: "bd69-file", page: "ConfirmMatchPage",color: "blue-color"},
    ];
  }

  onLoadParams() {
    if(this.navParams.data['params']){
      let params = this.navParams.data['params'];
      this.mClub.setClubID(params['clubID']);
      this.mLeagueID = params['leagueID'];
      this.leagueName = params['leagueName'];
    }
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_CLUB_INFO(this.mLeagueID, this.mClub.getClubID());
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerAdminsClubDetailPage", response => {
        this.onExtensionResponse(response);
      });
    });
    this.onLoadData();
  }

  ionViewDidEnter(){
    if(this.isDidEnter == 1){
      this.onLoadData();
    }
  }

  ionViewWillUnload(){
    this.mAppModule.removeSFSListener("ManagerAdminsClubDetailPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_CLUB_INFO) {
      this.onResponseClubInfo(params);
    }
  }

  onResponseClubInfo(params) {
    this.isLoadData = false;

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.INFO)) {
        this.mClub.fromSFSobject(content.getSFSObject(ParamsKey.INFO))
      }
    }else{
      this.mAppModule.hideLoading();
    }
  }
  onClickOption(option){
    if(option.page){
      this.isDidEnter = 1;
      this.navCtrl.push(option.page, {params: {clubID: this.mClub.getClubID(), leagueID: this.mLeagueID}});
    }
  }

}
