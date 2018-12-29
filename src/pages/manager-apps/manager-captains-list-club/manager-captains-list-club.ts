import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { Clubs } from '../../../providers/classes/clubs';
import { AppManager } from '../../../providers/manager/app-manager';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { log } from 'util';

/**
 * Generated class for the ManagerCaptainsListClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-captains-list-club',
  templateUrl: 'manager-captains-list-club.html',
})
export class ManagerCaptainsListClubPage {

  mActionSheetOptions: Array<{ id: number, name: string }> = [];
  userID: number = -1;
  mListClub: Array<Clubs> = [];
  nextPage: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider) {
    this.onLoadActionSheetOptions();
  }

  ionViewDidLoad() {
    this.onLoadParams();
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerCaptainsListClubPage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB_OF_CLUB_MANAGER(this.userID, this.nextPage);
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.userID = this.navParams.get('params');
      console.log(this.userID);

    }
  }
  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_CLUB_USER_MANAGE) {
      this.onParseListClubOfClubManagerParams(params);
    } else if (cmd == Bd69SFSCmd.APP_REMOVE_CLUB_MANAGER) {
      this.onResponeRemoveClubManager(params);
    }
  }

  onResponeRemoveClubManager(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.CLUB_ID);
        let index = this.mListClub.findIndex(club => {
          return club.getClubID() == id;
        })
        if (index > -1) {
          this.mListClub.splice(index, 1);
          this.mAppModule.showToast("Hủy lãnh đội thành công");
        }
      }
      if (this.mListClub.length == 0) {
        this.navCtrl.pop();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListClubOfClubManagerParams(params) {
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
          // let mDornors = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          let mClubs = this.mAppModule.getLeagueManager().onResponeClubsSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.nextPage == 0) {
            this.mListClub = [];
            this.mListClub = mClubs;
          } else {
            this.mListClub = this.mListClub.concat(mClubs);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      { id: 1, name: "Xem đội bóng" },
      { id: 2, name: "Hủy làm lãnh đội" }
    ];
  }

  onClickClub(club: Clubs) {
    this.mAppModule.showActionSheet(club.getName(), this.mActionSheetOptions, (id) => {
      if (id) {
        if (id == 1) {
          this.navCtrl.push("ViewClubPage", { params: {clubID: club.getClubID()} });
        } else {
          AppManager.getInstance().sendRequestAPP_REMOVE_CLUB_MANAGER(club.getManagerID(), club.getClubID());
        }
      }
    })
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onScroll();
      infiniteScroll.complete();
    }, 500);
  }


  onScroll() {
    if (this.nextPage > -1) {
      // this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
      AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB_OF_CLUB_MANAGER(this.userID, this.nextPage);
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.nextPage = 0;
      AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB_OF_CLUB_MANAGER(this.userID, this.nextPage);

      refresher.complete();
    }, 1500);
  }

}
