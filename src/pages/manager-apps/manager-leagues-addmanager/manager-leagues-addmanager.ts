import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { User } from '../../../providers/classes/user';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { AppManager } from '../../../providers/manager/app-manager';
import { Utils } from '../../../providers/core/app/utils';

/**
 * Generated class for the ManagerLeaguesAddmanagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-manager-leagues-addmanager',
  templateUrl: 'manager-leagues-addmanager.html',
})
export class ManagerLeaguesAddmanagerPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  leagueID: number = -1;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  mListUser: Array<User> = [];

  mListFillter: Array<User> = [];

  mListActionSheet: Array<{ id: number, name: string }> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
    this.onLoadActionSheet();
  }
  onLoadParams() {
    if (this.navParams.data["leagueID"]) {
      this.leagueID = this.navParams.get("leagueID");
    }
  }

  onLoadData() {
    AppManager.getInstance().sendRequestGET_LIST_LEAGUE_ADMIN();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.mSearchBar.setFocus();
    }, 1000);
  }

  onLoadActionSheet() {
    this.mListActionSheet = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Chọn làm ban tổ chức" }
    ];
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerLeaguesAddmanagerPage", respone => {
        this.onExtensionRespone(respone);
      });
    });

    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerLeaguesAddmanagerPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_LEAGUE_ADMIN) {
      this.onParseListUserParams(params);
    }
    else if (cmd == Bd69SFSCmd.APP_UPDATE_LEAGUE_ADMIN) {
      this.onResponeUpdateLeagueAdmin(params);
    }

  }

  onResponeUpdateLeagueAdmin(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.mAppModule.showToast("Cập nhật thành công");
        this.navCtrl.pop();
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
          this.mListFillter = this.mListUser;
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  doSearchLocal(){
    if (this.searchQuery.trim() != "") {
      this.mListUser = this.mListFillter.filter(user=>{
        return Utils.bodauTiengViet(user.getName()).toLowerCase().includes(Utils.bodauTiengViet(this.searchQuery).toLowerCase());
      })
    }else{
      this.mListUser = this.mListFillter;
    }
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.nextPage = 0;
        this.page = 0;
        this.oldSearchQuery = this.searchQuery;
      }
      if(this.nextPage == -1)return;

      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestGET_LIST_LEAGUE_ADMIN(this.searchQuery, this.nextPage);
        })
      } else {
        AppManager.getInstance().sendRequestGET_LIST_LEAGUE_ADMIN(this.searchQuery, this.nextPage);
      }

    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onClickSearch(false);
      infiniteScroll.complete();
    }, 200);
  }

  onClickUser(user: User) {
    this.mAppModule.showActionSheet(user.getName(), this.mListActionSheet, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(user);
        } else {
          this.doUpdateManagerLeague(user);
        }
      }
    })
  }

  goToProfileUser(user: User) {
    this.navCtrl.push("ProfilePage", { params: user.getUserID() });
  }

  doUpdateManagerLeague(user: User) {
    this.mAppModule.showLoading().then(() => {
      AppManager.getInstance().sendRequestAPP_UPDATE_LEAGUE_ADMIN(this.leagueID, user.getUserID());
    })
  }
}
