import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { User } from '../../../providers/classes/user';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Player } from '../../../providers/classes/player';
import { Utils } from '../../../providers/core/app/utils';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the ManagerAdminsClubsAddmemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface UserModels {
  user: User;
  isMember: boolean;
}

@IonicPage()
@Component({
  selector: 'page-manager-admins-clubs-addmember',
  templateUrl: 'manager-admins-clubs-addmember.html',
})
export class ManagerAdminsClubsAddmemberPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  clubID: number = -1;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  mListUser: Array<UserModels> = [];

  mListUserFillter: Array<UserModels> = [];

  mListPlayer: Array<Player> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.clubID = this.navParams.get("params");
    }
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestCLUB_GET_LIST_PLAYER(this.clubID, -1);
    this.mAppModule.getUserManager().sendRequestSearchUser("a", this.nextPage);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerAdminsClubsAddmemberPage", respone => {
        this.onExtensionResponse(respone);
      });
      this.onLoadData();
    });

    setTimeout(() => {
      this.mSearchBar.setFocus();
    }, 500);
  }


  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerAdminsClubsAddmemberPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.CLUB_GET_LIST_PLAYER) {
      this.onResponePlayerInClub(params);
    } else if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.onResponeSearchUser(params);
    } else if (cmd == Bd69SFSCmd.CLUB_ADD_PLAYER_INTO_CLUB) {
      this.onResponeAddUserIntoClub(params);
    } else if (cmd == Bd69SFSCmd.CLUB_REMOVE_PLAYER_FROM_CLUB) {
      this.onResponeRemovePlayerFromClub(params);
    }
  }
  onResponeRemovePlayerFromClub(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Xoá thành viên thành công");

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let userID: number = content.getInt(ParamsKey.USER_ID);

        let index = this.mListUserFillter.findIndex(user => {
          return user.user.getUserID() == userID;
        })

        if (index > -1) {
          this.mListUserFillter[index].isMember = false;
          let indexPlayer = this.mListPlayer.findIndex(player=>{
            return player.getPlayerID() == userID;
          })

          if(indexPlayer > -1){
            this.mListPlayer.splice(indexPlayer,1);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddUserIntoClub(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Thêm thành viên mới thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let userID: number = content.getInt(ParamsKey.USER_ID);

        let index = this.mListUserFillter.findIndex(user => {
          return user.user.getUserID() == userID;
        })

        if (index > -1) {
          let newPlayer = new Player();
          newPlayer.fromUser(this.mListUserFillter[index].user);
          this.mListUserFillter[index].isMember = true;
          this.mListPlayer.push(newPlayer);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeSearchUser(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.page = -1;
        }

        this.page = content.getInt(ParamsKey.PAGE);

        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayUsers = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          this.onParseUserModels(arrayUsers);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseUserModels(arrayUsers: Array<User>) {
    if (this.page < 0) {
      this.mListUser = [];
    }

    arrayUsers.forEach(user => {
      this.mListUser.push({
        user: user,
        isMember: this.onGetPlayerById(user.getUserID())
      });
    });

    this.mListUserFillter = this.mListUser;
  }

  onGetPlayerById(id: number): boolean {
    if (this.mListPlayer.length == 0) return false;
    for (let player of this.mListPlayer) {
      if (player.getPlayerID() == id) {
        return true;
      }
    }
    return false;
  }

  onResponePlayerInClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListPlayer = this.mAppModule.getPlayerManager().onParsePlayer(params, this.clubID);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  doSearchLocal() {
    if (this.searchQuery.trim() != "") {
      this.mListUserFillter = this.mListUser.filter(user => {
        return Utils.bodauTiengViet(user.user.getName().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery.toLowerCase()));
      })
    } else {
      this.mListUserFillter = this.mListUser;
    }
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.oldSearchQuery = this.searchQuery;
        this.nextPage = 0;
        this.page = 0;
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

  onClickUser(user: UserModels) {
    let options = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Xoá khỏi câu lạc bộ" }
    ];

    if (!user.isMember) {
      options[1].name = "Thêm vào câu lạc bộ";
    }

    this.mAppModule.showActionSheet(user.user.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToUserInfo(user.user);
        } else {
          this.mAppModule.showLoading().then(() => {
            if (user.isMember) {
              Bd69SFSConnector.getInstance().sendRequestCLUB_REMOVE_PLAYER_FROM_CLUB(user.user.getUserID(), this.clubID);
            } else {
              Bd69SFSConnector.getInstance().sendRequestCLUB_ADD_PLAYER_INTO_CLUB(user.user.getUserID(), this.clubID);
            }
          });
        }
      }
    });
  }

  goToUserInfo(user: User) {

  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != "") {
        this.onClickSearch();
      } else {
        this.mAppModule.getUserManager().sendRequestSearchUser("a", this.nextPage);
      }
      infiniteScroll.complete();
    }, 1000);
  }
}
