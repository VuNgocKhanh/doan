import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clubs } from '../../../providers/classes/clubs';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { ManagerClubInLeagues } from '../../../providers/manager/user-manager';

/**
 * Generated class for the ManagerAdminsClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-admins-club',
  templateUrl: 'manager-admins-club.html',
})
export class ManagerAdminsClubPage {

  searchQuery: string = "";

  mListClubs: Array<ManagerClubInLeagues> = [];

  mListClubsFillter: Array<ManagerClubInLeagues> = [];

  numberEnter: number = -1;

  mListActionSheet: Array<{ id: number, name: string }> = [
    { id: 0, name: "Xem thông tin" },
    { id: 1, name: "Cập nhật đội trưởng" }
  ];

  mUserID: number = 1;
  numberDidEnter: number = -1;

  isLoadData: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.mUserID = this.mAppModule.getUserManager().getUser().getUserID();
  }

  onLoadData() {
    // this.mAppModule.getClubManager().sendRequestGetListClubOfManager(this.mUserID);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerAdminsClubPage", response => {
        this.onExtensionResponse(response);
      });
      this.mListClubs = this.mAppModule.getUserManager().getListManagerClubInLeague();
      this.onLoadData();
    });
  }

  ionViewDidEnter() {
    if (this.numberEnter > 0) {
      this.onLoadData();
    }
    this.numberEnter++;
  }

  ionViewWillUnLoad() {
    Bd69SFSConnector.getInstance().removeListener("ManagerAdminsClubPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (cmd == Bd69SFSCmd.GET_LIST_MANAGE) {
      this.onResponseListClub(params);
    }
  }

  onResponseListClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
          this.mAppModule.getUserManager().onResponeUserListManager(content);
          let arrayClubs = this.mAppModule.getUserManager().getListManagerClubInLeague();
          this.mListClubs = arrayClubs;
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  getItems() {

  }



  onClickClub(club: ManagerClubInLeagues) {
    this.navCtrl.push("ManagerAdminsClubDetailPage", { params: {clubID: club.getClub().getClubID(), leagueID: club.getLeague().getLeagueID(), leagueName: club.getLeague().getName()}});
  }


  // doInfinite(infiniteScroll) {
  //   setTimeout(() => {
  //     if (this.searchQuery.trim() != "") {
  //       this.onClickSearch();
  //     } else {
  //       this.onLoadData();
  //     }
  //     infiniteScroll.complete();
  //   }, 200);
  // }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 1500);
  }

  onClickLogin(){
    this.navCtrl.setRoot("TabsPage");
  }

}
