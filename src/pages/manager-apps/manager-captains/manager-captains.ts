import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Player } from '../../../providers/classes/player';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { User } from '../../../providers/classes/user';
import { AppManager } from '../../../providers/manager/app-manager';
import { Utils } from '../../../providers/core/app/utils';

/**
 * Generated class for the ManagerCaptainsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-captains',
  templateUrl: 'manager-captains.html',
})
export class ManagerCaptainsPage {

  nextPage: number = 0;

  page: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  mActionSheetOptions: Array<{ id: number, name: string }> = [];

  load: number = 0;

  mListClubManagers: Array<User> = [];

  mListClubManagersFillter: Array<User> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider) {
    this.onLoadActionSheetOptions();
  }

  onLoadData() {
    AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB_MANAGER();
  }

  ionViewDidEnter() {
    if (this.load > 0) {
      AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB_MANAGER();
    }
    this.load++;
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerCaptainsPage", respone => {
        this.onExtensionRespone(respone);
      });

      this.onLoadData();

    });
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerCaptainsPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_CLUB_MANAGER) {
      this.onParseListClubManagerParams(params);
    }
  }

  onParseListClubManagerParams(params) {

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
          let arrayUsers = this.mAppModule.getLeagueManager().onResponeClubManagerSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListClubManagers = arrayUsers;
          } else {
            this.mListClubManagers = this.mListClubManagers.concat(arrayUsers);
          }

          this.mListClubManagersFillter = this.mListClubManagers;
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  doSearchLocal(){
    if (this.searchQuery.trim() != '') {
      this.mListClubManagers = this.mListClubManagersFillter.filter(user => {
        return Utils.bodauTiengViet(user.getName().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery.toLowerCase()));
      });
    } else {
      this.mListClubManagers = this.mListClubManagersFillter;
    }
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      { id: 1, name: "Xem đội bóng" },
      { id: 2, name: "Hủy làm lãnh đội" }
    ];
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.page = 0;
        this.nextPage = 0;
      }

      if (this.nextPage == -1) return;

      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB_MANAGER(this.searchQuery, this.nextPage);
        });
      }else{
        AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB_MANAGER(this.searchQuery, this.nextPage);
      }
    }
  }

  onClickItem(user: User) {
    this.navCtrl.push("ManagerCaptainsListClubPage", { params: user.getUserID() });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onScroll();
      infiniteScroll.complete();
    }, 500);
  }

  onScroll() {
    if(this.searchQuery.trim() != ''){
      this.onClickSearch();
    }else{
      this.onLoadData();
    }
  }
}
