import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { AppManager } from '../../../providers/manager/app-manager';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';

/**
 * Generated class for the ManagerAdminLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-admin-league',
  templateUrl: 'manager-admin-league.html',
})
export class ManagerAdminLeaguePage {

  nextPage: number = 0;

  page: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  mActionSheetOptions: Array<{ id: number, name: string }> = [];

  mListUser: Array<User> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadActionSheetOptions();
  }

  onLoadData() {
    AppManager.getInstance().sendRequestGET_LIST_LEAGUE_ADMIN();
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.onLoadData();
    }
  }

  numberDidEnter: number = -1;
  ionViewDidEnter() {
    this.numberDidEnter++;
    if (this.numberDidEnter > 0) {
      this.page = 0;
      this.nextPage = 0;
      this.searchQuery = "";
      this.oldSearchQuery = "";
      this.onLoadData();
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerAdminLeaguePage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerAdminLeaguePage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_LEAGUE_ADMIN) {
      this.onParseListUserParams(params);
    } else if (cmd == Bd69SFSCmd.APP_REMOVE_LEAGUE_ADMIN) {
      this.onResponeRemoveLeagueAdmin(params);
    }

  }

  onResponeRemoveLeagueAdmin(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let userID = content.getInt(ParamsKey.USER_ID);
        let index = this.mListUser.findIndex(user => {
          return user.getUserID() == userID;
        })
        if (index > -1) {
          this.mListUser.splice(index, 1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onParseListUserParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);
        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayuser = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListUser = [];
            this.mListUser = arrayuser;
          } else {
            this.mListUser = this.mListUser.concat(arrayuser);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickAdd() {
    this.navCtrl.push("ManagerAdminLeagueAddPage");
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.nextPage = 0;
        this.page = 0;
        this.oldSearchQuery = this.searchQuery;
      }
      if(this.nextPage == -1) return;
      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestGET_LIST_LEAGUE_ADMIN(this.searchQuery, this.nextPage);
        })
      } else {
        AppManager.getInstance().sendRequestGET_LIST_LEAGUE_ADMIN(this.searchQuery, this.nextPage);
      }

    }
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      { id: 1, name: "Xem danh sách giải đấu" },
      { id: 2, name: "Huỷ làm ban tổ chức" }
    ];
  }

  onClickItem(user: User) {
    this.mAppModule.showActionSheet(user.getName(), this.mActionSheetOptions, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(user);
        } else {
          this.mAppModule.showLoading().then(() => {
            AppManager.getInstance().sendRequestAPP_REMOVE_LEAGUE_ADMIN(user.getUserID());
          });
        }
      }
    })
  }

  goToProfileUser(user) {
    this.navCtrl.push("ManagerAdminLeagueListPage",{
      user : user
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.page = 0;
      this.nextPage = 0;
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != "") {
        this.onClickSearch();
      } else {
        this.onLoadData();
      }
      infiniteScroll.complete();
    }, 200);
  }
}
