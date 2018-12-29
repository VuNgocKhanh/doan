import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { AppManager } from '../../../providers/manager/app-manager';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { User } from '../../../providers/classes/user';

@IonicPage()
@Component({
  selector: 'page-manager-admin-league-list',
  templateUrl: 'manager-admin-league-list.html',
})
export class ManagerAdminLeagueListPage {

  mListLeagues: Array<Leagues> = [];

  nextPage: number = 0;

  page: number = 0;

  mActionSheetOptions: Array<{ id: number, name: string }> = [];

  numberDidEnter: number = 0;

  mUser : User = new User();

  constructor(
    public mAlertController: AlertController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    if(this.navParams.get('user'))  this.mUser = this.navParams.get("user");
  }



  onLoadData() {
    this.onLoadLeagues();
    this.onLoadActionSheetOptions();
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0){
      this.onLoadLeagues();
    }
    this.numberDidEnter++;
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerLeaguesPage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.doLogConsole("Unload ..",null);
    this.mAppModule.removeSFSListener("ManagerLeaguesPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN) {
      this.onParseListLeagueOfSystemParams(params);
    } else if (cmd == Bd69SFSCmd.APP_DELETE_LEAGUE) {
      this.onResponeDeleteLeague(params);
    }
    else if (cmd == Bd69SFSCmd.APP_UPDATE_LEAGUE_INFO) {
      this.onResponeUpdateLeagueInfo(params);
    }
  }


  onLoadLeagues() {
    /**Send request get league of system */
    AppManager.getInstance().sendRequestAPP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN(this.mUser.getUserID(),this.nextPage);
  }

  onResponeUpdateLeagueInfo(params) {

    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
          let index = this.mListLeagues.findIndex(league => {
            return league.getLeagueID() == leagueID;
          })
          if (index > -1) {
            this.mListLeagues[index].fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeDeleteLeague(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.LEAGUE_ID)) {
          let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
          let index = this.mListLeagues.findIndex(league => {
            return league.getLeagueID() == leagueID;
          })
          if (index > -1) {
            this.mListLeagues.splice(index, 1);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListLeagueOfSystemParams(params) {
    
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
          let arrayLeagues = this.mAppModule.getLeagueManager().onParseLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListLeagues = [];
            this.mListLeagues = arrayLeagues;
          } else {
            this.mListLeagues = this.mListLeagues.concat(arrayLeagues);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  
  onClickItem(league: Leagues) {
    this.mAppModule.showActionSheet(league.getName(), this.mActionSheetOptions, (id) => {
      if (id) {
        if (id == 1) {
          this.goToLeagueManager(league.getLeagueID());
        } else if (id == 2) {
          this.doEditLeagueName(league);
        } else if (id == 3) {
          this.doUpdateManagerLeague(league);
        } else {
          this.doDeleteLeague(league);
        }
      }
    })
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Chỉnh sửa tên giải đấu" },
      { id: 3, name: "Cập nhật ban tổ chức" },
      { id: 4, name: "Xoá" }
    ];
  }

  goToLeagueManager(leagueID: number) {
    this.navCtrl.push("LeagueAdminToolPage", {params: leagueID});
  }

  doEditLeagueName(league: Leagues) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật tên giải đấu");
    alert.setSubTitle(league.getName());
    alert.addInput({
      type: "text",
      value: league.getName(),
      name: "leagueName"
    });
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.leagueName.trim() == "") {
          this.mAppModule.showToast("Tên giải đấu không thể bỏ trống");
          return;
        }
        league.setName(data.leagueName);
        this.sendRequestUpdateLeagueName(league);
      }
    });
    alert.present();
  }

  doDeleteLeague(league: Leagues) {
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setSubTitle(league.getName());
    alert.setMessage("Bạn xác nhận muốn xoá giải đấu");
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Xác nhận",
      handler: () => {
        this.sendRequestDeleteLeague(league);
      }
    });
    alert.present();
  }

  doUpdateManagerLeague(league: Leagues) {
    this.navCtrl.push("ManagerLeaguesAddmanagerPage", { leagueID: league.getLeagueID() });
  }

  sendRequestDeleteLeague(league: Leagues) {

    this.mAppModule.showLoading().then(() => {
      AppManager.getInstance().sendRequestAPP_DELETE_LEAGUE(league.getLeagueID());
    })
  }

  sendRequestUpdateLeagueName(league: Leagues) {
    this.mAppModule.showLoading().then(() => {
      AppManager.getInstance().sendRequestAPP_UPDATE_LEAGUE_INFO(league.getLeagueID(), league);
    })
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onLoadLeagues();
      infiniteScroll.complete();
    }, 200);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }
}
