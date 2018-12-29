import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { AppManager } from '../../../providers/manager/app-manager';

/**
 * Generated class for the ManagerRefereAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-refere-add',
  templateUrl: 'manager-refere-add.html',
})
export class ManagerRefereAddPage {
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

  onloadeddata() {
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
      this.mAppModule.addBd69SFSResponeListener("ManagerRefereAddPage", respone => {
        this.onExtensionRespone(respone);
      });
    });

    this.onloadeddata();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerRefereAddPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.onParseListUserParams(params);
    } else if (cmd == Bd69SFSCmd.APP_ADD_NEW_REFEREE) {
      this.onResponeAddNewRefereeParams(params);
    } else if (cmd == Bd69SFSCmd.APP_DELETE_REFEREE) {
      this.onResponeDeleteRefereeParams(params);
    }
  }

  onResponeAddNewRefereeParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.USER_ID);
        let index = this.mListUser.findIndex(user => {
          return user.getUserID() == id;
        })
        if (index > -1) {
          this.mListUser[index].setType(1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeDeleteRefereeParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.REFEREE_ID);
        let index = this.mListUser.findIndex(user => {
          return user.getUserID() == id;
        })
        if (index > -1) {
          this.mListUser[index].setType(0);
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
      { id: 2, name: "Huỷ làm trọng tài" }
    ];
    if (user.getType() != 1) {
      options[1].name = "Chọn làm trọng tài";
    }
    this.mAppModule.showActionSheet(user.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(user);
        } else {
          if (user.getType() == 1) {
            this.mAppModule.showLoading().then(() => {
              AppManager.getInstance().sendRequestAPP_DELETE_REFEREE(user.getUserID());
            });
          } else {
            this.mAppModule.showLoading().then(() => {
              AppManager.getInstance().sendRequestAPP_ADD_NEW_REFEREE(user.getUserID());
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
      if (this.searchQuery.trim() != '') {
        this.onClickSearch(false);
      } else {
        this.onloadeddata();
      }

      infiniteScroll.complete();
    }, 200);
  }
}
