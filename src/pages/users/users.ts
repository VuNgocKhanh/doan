import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Clubs } from '../../providers/classes/clubs';
import { Leagues } from '../../providers/classes/league';
import { User } from '../../providers/classes/user';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { Player } from '../../providers/classes/player';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})


export class UsersPage {

  private mLeague: Leagues = new Leagues();

  mClubs: Array<Clubs> = [];

  mLeagues: Array<Leagues> = [];

  mUser: User = new User();

  mList: Array<{ id: number, icon: string, name: string, color: string, title: string }> = [
    { id: 0, icon: "bd69-facebook", name: "Kết nối mạng xã hội", color: "blue-color", title: "Mạng xã hội" },
    { id: 1, icon: "bd69-lamp", name: "Góp ý cho nhà phát triển", color: "orange-color", title: "Góp ý" },
    { id: 2, icon: "bd69-info", name: "Thông tin sản phẩm", color: "blueviolet-color", title: "Thông tin sản phẩm" },
    { id: 3, icon: "bd69-question", name: "Câu hỏi thường gặp", color: "green-color", title: "Câu hỏi thường gặp" }
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {


    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("UsersPage", respone => {
        // this.onExtensionRespone(respone);
      });
    });
  }

  onLoadData() {
    this.mAppModule.getClubManager().sendRequestGetClubOfUser();
    this.mAppModule.getLeagueManager().sendRequestGetLeagueOfUser();
    this.mAppModule.getUserManager().sendRequestUserInfo();
    Bd69SFSConnector.getInstance().sendRequestGetListClubOfManager();
  }

  ionViewDidEnter() {
    this.onLoadData();
    this.mUser = this.mAppModule.getUserManager().getUser();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }


  goSearchPage(params) {
    this.navCtrl.push("SearchClubLeaguePage", { params: params });
  }

  goToLeagueDetail(item: Leagues) {
    this.navCtrl.push("LeagueDetailPage", { params: item.getLeagueID() });
  }

  goToClubDetail(item: Clubs) {
    this.navCtrl.push("ViewClubPage", { params: { clubID: item.getClubID() } });
  }

  goToUserProfile() {
    this.navCtrl.push("ProfilePage", { params: this.mUser.getUserID() });
  }

  onClickProfileUser() {
    this.navCtrl.push("UserListProfliePage");
  }

  goToSearch() {
    this.navCtrl.push("Bd69SearchPage");
  }

  onClickOthers(item: any) {

    if (item == "Cài đặt") {
      this.navCtrl.push("DevelopPage", { title: "Cài đặt" });
    }
    else if (item.id == 0) {
      this.navCtrl.push("UsersFacebookLinkedPage", { params: this.mUser });
    }
    else if (item.id == 1) {
      this.navCtrl.push("UsersFeedbackPage");
    }
    else if (item.id == 2) {
      this.navCtrl.push("UsersAppInfoPage");
    }
    else if (item.id == 3) {
      this.navCtrl.push("UsersQuestionPage");
    }
  }

  logout() {
    this.mAppModule.getStoreController().removeKeyDataFromStorage(APPKEYS.USER_INFO).then(() => {
      this.mAppModule.getUserManager().sendRequestLogout();
    })
  }


  onClickManagerLeague() {
    this.mAppModule.doSwithToLeagueManager();
  }

  onClickManagerApps() {
    this.mAppModule.doSwithToManagerApps();
  }
}
