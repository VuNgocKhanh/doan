import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerCaptainsAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-captains-add',
  templateUrl: 'manager-captains-add.html',
})
export class ManagerCaptainsAddPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  mListUser: Array<User> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider) {
  }

  ngAfterViewInit(){
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
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerRefereAddPage");
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
        if (content.containsKey(ParamsKey.ARRAY)) {
          let mUsers = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.nextPage == 0) {
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
      if(this.nextPage ==-1) return;
      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
        })
      } else {
        this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
      }

    }
  }

  onClickPermisson(user: User) {
    if (user.getType() == 1) {
      /**Huy lam trong tai */
    } else {
      /**Chon lam trong tai */

    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onClickSearch(false);
      infiniteScroll.complete();
    }, 200);
  }

}
