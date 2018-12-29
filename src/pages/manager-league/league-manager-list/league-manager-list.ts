import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the LeagueManagerListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-league-manager-list',
  templateUrl: 'league-manager-list.html',
})
export class LeagueManagerListPage {

  mListLeagueManager: Array<User> = [];
  
  mLeague: Leagues = new Leagues();

  numberDidEnter = 0;

  constructor(
    public mAppmodule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.mAppmodule.getLeagueManager().sendRequestGetListLeagueMangagerInLeague(this.mLeague.getLeagueID());
    }
    this.numberDidEnter++;
  }
  ionViewDidLoad() {
    this.mAppmodule._LoadAppConfig().then(() => {
      this.mAppmodule.addBd69SFSResponeListener("LeagueManagerListPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.mAppmodule.getLeagueManager().sendRequestGetListLeagueMangagerInLeague(this.mLeague.getLeagueID());
    })
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_LIST_MANAGER_OF_LEAGUE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.mListLeagueManager = this.mAppmodule.getUserManager().onResponeUserSFSArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
      } else {
        this.mAppmodule.showParamsMessage(params);
      }
    }

    else if (cmd == Bd69SFSCmd.REMOVE_MANAGER_FROM_LEAGUE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let userID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.USER_ID);
        let index = this.mListLeagueManager.findIndex(user => {
          return user.getUserID() == userID;
        })
        if (index > -1) {
          this.mAppmodule.showToast("Đã xoá " + this.mListLeagueManager[index].getName() + " khỏi giải đấu");
          this.mListLeagueManager.splice(index, 1);
        }
      } else {
        this.mAppmodule.showToast("Đã có lỗi xảy ra");
      }
      this.mAppmodule.hideLoading();
    }
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague.setLeagueID(this.navParams.get("params"));
    }
  }

  ionViewWillUnload() {
    this.mAppmodule.removeSFSListener("LeagueManagerListPage");
  }

  onClickAdd() {
    this.navCtrl.push("Bd69AddLeaguemangerIntoLeaguePage", { params: { league: this.mLeague, listmanager: this.mListLeagueManager } });
  }

  onClickManager(item: User) {
    let array: Array<{ id: number, name: string }> = [
      { id: 0, name: "Xem thông tin" },
      { id: 1, name: "Huỷ làm quản lí" }
    ];
    this.mAppmodule.showActionSheet(item.getName(), array, (id) => {
      if (id == 0) {
        this.navCtrl.push("ProfilePage", { params: item.getUserID() });
      } else if (id == 1) {
        this.mAppmodule.showLoading();
        this.mAppmodule.getLeagueManager().sendRequestRemoveLeagueManagerIntoLeague(item.getUserID(), this.mLeague.getLeagueID());
      }
    })
  }
}
