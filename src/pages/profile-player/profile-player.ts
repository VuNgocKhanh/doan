import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { User } from '../../providers/classes/user';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Player } from '../../providers/classes/player';

/**
 * Generated class for the ProfilePlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-player',
  templateUrl: 'profile-player.html',
})
export class ProfilePlayerPage {
  @ViewChild(Content) mContent: Content;

  mUser: User = new User();

  mPlayerID: number = -1;

  tabSelected: number = 0;

  mListTabs: Array<{ id: number, name: string }> = [
    { id: 0, name: "Tổng quan" },
    { id: 1, name: "Câu lạc bộ" },
    { id: 2, name: "Giải đấu" }
  ];

  listInfoInClub: Array<User> = [];
  listInfoInLeague: Array<User> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mPlayerID = this.navParams.get("params");
    }
  }

  onLoadData() {
    this.mAppModule.showLoading();
    this.mAppModule.getUserManager().sendRequestUserInfo(this.mPlayerID);

    Bd69SFSConnector.getInstance().sendRequestGetClubOfUser();
    Bd69SFSConnector.getInstance().sendRequestGetLeagueOfUser()
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ProfilePlayerPage", respone => {
        this.onExtensionResponse(respone);
      })
      this.onLoadData();
    });
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ProfilePlayerPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.GET_USER_INFO) {
      this.onResponeGetUserInfo(params);
    } else if (cmd == Bd69SFSCmd.GET_CLUB_OF_USER) {
      this.onResponseClubOfUser(params);
    } else if (cmd == Bd69SFSCmd.GET_LEAGUE_OF_USER) {
      this.onResponseLeagueOfUser(params);
    } else if (cmd == Bd69SFSCmd.GET_PLAYER_IN_CLUB_INFO) {
      this.onResponseGetPlayerInfoInClub(params);
    } else if (cmd == Bd69SFSCmd.GET_PLAYER_IN_LEAGUE_INFO) {
      this.onResponseGetPlayerInfoInLeague(params);
    }
  }

  onResponeGetUserInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
      let userstatistic = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.STATISTIC);
      this.mUser.fromSFSObject(info);
      this.mUser.getUserStatistic().fromSFSObject(userstatistic);
    }

  }

  onResponseClubOfUser(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ARRAY)) {
        let array = content.getSFSArray(ParamsKey.ARRAY);

        this.listInfoInClub = [];

        for (let i = 0; i < array.size(); i++) {
          let clubID = array.getSFSObject(i).getInt(ParamsKey.CLUB_ID);

          Bd69SFSConnector.getInstance().sendRequestGetPlayerInClubInfo(this.mPlayerID, clubID);
        }
      }
    }
    this.mAppModule.hideLoading();
  }

  onResponseLeagueOfUser(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ARRAY)) {
        let array = content.getSFSArray(ParamsKey.ARRAY);

        this.listInfoInLeague = [];

        for (let i = 0; i < array.size(); i++) {
          let leagueID = array.getSFSObject(i).getInt(ParamsKey.LEAGUE_ID);

          Bd69SFSConnector.getInstance().sendRequestGetPlayerInLeagueInfo(this.mPlayerID, leagueID);
        }
      }
    }
  }

  onResponseGetPlayerInfoInClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let info = content.getSFSObject(ParamsKey.INFO);
        let clubName = content.getUtfString(ParamsKey.CLUB_NAME);

        let newUser = new Player();
        newUser.fromSFSObject(info);
        newUser.setClubName(clubName);

        this.listInfoInClub.push(newUser);
      }
    }
  }

  onResponseGetPlayerInfoInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
        let leagueName = content.getSFSObject(ParamsKey.DATA).getUtfString(ParamsKey.LEAGUE_NAME);
        let clubName = content.getSFSObject(ParamsKey.INFO).getUtfString(ParamsKey.CLUB_NAME);

        let newUser = new Player();
        newUser.fromSFSObject(info);
        newUser.setLeagueName(leagueName);
        newUser.setClubName(clubName);
        
        this.listInfoInLeague.push(newUser);
      }
    }
  }

  // onClickTab(tab) {
  //   this.tabSelected = tab.id;
  // }

  onClickTab(mTab, $event) {
    this.tabSelected = mTab.id;
    this.mContent.scrollToTop(200);

    this.doMoveAnimateBar();
  }

  doMoveAnimateBar() {
    let animated = document.getElementById("animatedID");
    if (animated) {
      animated.style.transform = "translateX(" + (this.tabSelected * 100) + "%)";
    }
  }

}
