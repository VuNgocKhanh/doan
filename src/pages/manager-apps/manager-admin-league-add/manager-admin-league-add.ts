import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { AppManager } from '../../../providers/manager/app-manager';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';

/**
 * Generated class for the ManagerAdminLeagueAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-admin-league-add',
  templateUrl: 'manager-admin-league-add.html',
})
export class ManagerAdminLeagueAddPage {

  @ViewChild(Searchbar) mSearchBar: Searchbar;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  mListUser: Array<User> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  onLoadData() {
    this.mAppModule.getUserManager().sendRequestSearchUser("a", this.nextPage);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mSearchBar.setFocus();
    }, 1000);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerAdminLeagueAddPage", respone => {
        this.onExtensionRespone(respone);
      });
      this.onLoadData();
    });

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerAdminLeagueAddPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.onParseListUserParams(params);
    } else if (cmd == Bd69SFSCmd.APP_REMOVE_LEAGUE_ADMIN) {
      this.onResponeRemoveLeagueAdmin(params);
    } else if (cmd == Bd69SFSCmd.APP_ADD_LEAGUE_ADMIN) {
      this.onResponeAddLeagueAdmin(params);
    }
  }

  onResponeAddLeagueAdmin(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let userID = content.getInt(ParamsKey.USER_ID);
        let index = this.mListUser.findIndex(user => {
          return user.getUserID() == userID;
        })
        if (index > -1) {
          this.mListUser[index].setRole(1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
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
          this.mListUser[index].setRole(0);
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
          let mUsers = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListUser = [];
            this.mListUser = mUsers;
          } else {
            this.mListUser = this.mListUser.concat(mUsers);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.nextPage = 0;
        this.page = 0;
        this.oldSearchQuery = this.searchQuery;
      }
      if (this.nextPage == -1) return;
      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
        })
      } else {
        this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
      }

    }
  }

  onClickUser(user: User) {
    let options = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Huỷ làm ban tổ chức" }
    ];
    if (user.getRole() != 1) {
      options[1].name = "Chọn làm ban tổ chức";
    }
    this.mAppModule.showActionSheet(user.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(user);
        } else {
          if (user.getRole() == 1) {
            this.mAppModule.showLoading().then(() => {
              AppManager.getInstance().sendRequestAPP_REMOVE_LEAGUE_ADMIN(user.getUserID());
            });
          } else {
            this.mAppModule.showLoading().then(() => {
              AppManager.getInstance().sendRequestAPP_ADD_LEAGUE_ADMIN(user.getUserID());
            });
          }
        }
      }
    })

  }

  goToProfileUser(user: User) {
    this.navCtrl.push("ProfilePage", { params: user.getUserID() });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != "") {
        this.onClickSearch(false);
      } else {
        this.onLoadData();
      }
      infiniteScroll.complete();
    }, 200);
  }

}
