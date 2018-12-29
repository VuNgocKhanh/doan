import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-user',
  templateUrl: 'manager-user.html',
})
export class ManagerUserPage {

  mListUser: Array<User> = [];

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  onLoadData() {
    this.mAppModule.getUserManager().sendRequestSearchUser("a", this.nextPage);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerUserPage", respone => {
        this.onExtensionRespone(respone);
      });
      this.onLoadData();
    });

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerUserPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.onParseListUserParams(params);
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

  onClickAddUser() {
    this.navCtrl.push("ManagerUserAddPage");
  }

  onClickUser(user: User) {
    let options = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Xóa cầu thủ khỏi hệ thống" }
    ];
    this.mAppModule.showActionSheet(user.getName(), options, id => {
        if (id == 1) {
          this.goToProfileUser(user);
        } else if (id == 2) {
          this.doDeleteUser(user)
        }
    })

  }

  goToProfileUser(user: User) {
    this.navCtrl.push("ProfilePage", { params: user.getUserID() });
  }

  doDeleteUser(user: User){

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
