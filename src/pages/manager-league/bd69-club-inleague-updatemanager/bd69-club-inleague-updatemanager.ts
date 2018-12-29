import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Player } from '../../../providers/classes/player';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { User, LeagueSearchUsers } from '../../../providers/classes/user';
import { Utils } from '../../../providers/core/app/utils';

/**
 * Generated class for the Bd69ClubInleagueUpdatemanagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-club-inleague-updatemanager',
  templateUrl: 'bd69-club-inleague-updatemanager.html',
})
export class Bd69ClubInleagueUpdatemanagerPage {

  mListFillter: Array<{ id: number, name: string }> = [];

  mIDSelected: number = 2;

  mLeagueID: number = -1;

  mClubID: number = -1;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  page: number = 0;

  nextPage: number = 0;

  mListPlayer: Array<Player> = [];

  mListPlayerFillter: Array<Player> = [];

  mListUser: Array<LeagueSearchUsers> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadFillterOptions();
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mLeagueID = params["leagueID"];
      this.mClubID = params["clubID"];
    }
  }

  onLoadData() {
    // this.mAppModule.getLeagueManager().sendRequestGetPlayerInLeague(this.mLeagueID,this.mClubID,-1);
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_PLAYER(this.mLeagueID, this.mClubID, -1);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69ClubInleagueUpdatemanagerPage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69ClubInleagueUpdatemanagerPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onParseUserInLeague(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_USER) {
      this.onParseUser(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_CLUB_MANAGER) {
      this.onResponeUpdateClubManager(params);
    }
  }

  onResponeUpdateClubManager(params) {
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

  onParseUser(params) {
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
          let arrayUser = this.mAppModule.getUserManager().onResponeLeagueSearchUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListUser = arrayUser;
          } else {
            this.mListUser = this.mListUser.concat(arrayUser);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseUserInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content && content.containsKey(ParamsKey.ARRAY)) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        this.mListPlayer = this.mAppModule.getPlayerManager().onParsePlayer(params,clubID,leagueID);
        this.mListPlayerFillter = this.mListPlayer;
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickOptionFillter(option) {
    this.mIDSelected = option.id;
    if (this.mIDSelected == 2) this.mListPlayerFillter = this.mListPlayer;
  }

  onLoadFillterOptions() {
    this.mListFillter = [
      { id: 2, name: "Trong câu lạc bộ" },
      { id: 1, name: "Tất cả" }
    ];
  }

  doSearch() {
    if (this.mIDSelected == 2) {
      if (this.searchQuery.trim() != '') {
        this.mListPlayerFillter = this.mListPlayer.filter(player => {
          return Utils.bodauTiengViet(player.getName()).toLowerCase().includes(Utils.bodauTiengViet(this.searchQuery).toLowerCase());
        })
      } else {
        this.mListPlayerFillter = this.mListPlayer;
      }
    }
  }

  search(infinite?: boolean) {
    if (this.mIDSelected == 2) {
      this.doSearch();
      return;
    }
    if (this.searchQuery.trim() != '') {
      if (this.searchQuery != this.oldSearchQuery) {
        this.oldSearchQuery = this.searchQuery;
        this.nextPage = 0;
        this.page = 0;
      }

      if (this.nextPage == -1) {
        return;
      }

      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        this.mAppModule.getLeagueManager().sendRequestLEAGUE_SEARCH_USER(this.mLeagueID, this.searchQuery, this.nextPage);
      }
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != '') {
        this.search();
      }
      infiniteScroll.complete();
    }, 500);
  }

  onClickPlayer(player : Player){
    let options = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Chọn làm lãnh đội" }
    ];


    this.mAppModule.showActionSheet(player.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(player);
        } else {
          this.doUpdateManagerClubInLeague(player.getPlayerID());
        }
      }
    });
  }

  onClickUser(user: LeagueSearchUsers) {
    let options = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Chọn làm lãnh đội" }
    ];


    this.mAppModule.showActionSheet(user.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(user);
        } else {
          this.doUpdateManagerClubInLeague(user.getUserID());
        }
      }
    });
  }

  goToProfileUser(user) {

  }

  doUpdateManagerClubInLeague(userID: number) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_UPDATE_CLUB_MANAGER(userID, this.mClubID, this.mLeagueID);
    })
  }
}
