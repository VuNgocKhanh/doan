import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { AppManager } from '../../../providers/manager/app-manager';

/**
 * Generated class for the ManagerLeaguesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-leagues',
  templateUrl: 'manager-leagues.html',
})
export class ManagerLeaguesPage {

  mListLeagues: Array<Leagues> = [];

  nextPage: number = 0;

  page: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  mActionSheetOptions: Array<{ id: number, name: string }> = [];

  mListFillter: Array<{ id: number, name: string }> = [];

  mIDSelected: number = -1;

  numberDidEnter: number = 0;

  constructor(
    public mAlertController: AlertController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  onSearchBarClicked(event) {
    console.log("Stop propagation");
    event.stopPropagation();
  }

  onLoadData() {
    this.onLoadLeagues();
    this.onLoadActionSheetOptions();
    this.onLoadFillterOptions();
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
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
    this.mAppModule.doLogConsole("Unload ..", null);
    this.mAppModule.removeSFSListener("ManagerLeaguesPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_LEAGUE) {
      this.onParseListLeagueOfSystemParams(params);
    } else if (cmd == Bd69SFSCmd.APP_DELETE_LEAGUE) {
      this.onResponeDeleteLeague(params);
    }
    else if (cmd == Bd69SFSCmd.APP_UPDATE_LEAGUE_INFO) {
      this.onResponeUpdateLeagueInfo(params);
    }
  }

  onClickAdd() {
    this.navCtrl.push("AddLeaguePage");
    // this.navCtrl.push("SlideLeagueDetailPage");
  }

  onLoadLeagues() {
    /**Send request get league of system */
    AppManager.getInstance().sendRequestAPP_GET_LIST_LEAGUE(null, null, this.mIDSelected);
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

  onClearQuer() {
    if (this.mIDSelected == -1) {
      this.onLoadLeagues();
    }
  }

  onClickOptionFillter(option, $event) {
    this.mIDSelected = option.id;
    console.log(this.mIDSelected);
    
    let element: HTMLElement = $event.target;
    element.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }

  onClickSearch(fillter?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.searchQuery != this.oldSearchQuery) {
        this.oldSearchQuery = this.searchQuery;
        this.page = 0;
        this.nextPage = 0;
      }
      if (fillter) {
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_GET_LIST_LEAGUE(this.searchQuery, this.nextPage, this.mIDSelected);
        });
      } else {
        AppManager.getInstance().sendRequestAPP_GET_LIST_LEAGUE(this.searchQuery, this.nextPage, this.mIDSelected);
      }

    } else {
      if (fillter) {
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_GET_LIST_LEAGUE(null, 0, this.mIDSelected);
        });
      } else if (this.mIDSelected == -1) {
        this.onLoadLeagues();
      }
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

  onLoadFillterOptions() {
    this.mListFillter = [
      { id: -1, name: "Tất cả" },
      { id: 0, name: "Sắp diễn ra" },
      { id: 1, name: "Đang diễn ra" },
      { id: 2, name: "Đã kết thúc" }
    ];
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
    this.navCtrl.push("LeagueAdminToolPage", { params: leagueID });
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
      this.onClickSearch();
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