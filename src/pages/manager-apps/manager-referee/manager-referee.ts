import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Referee } from '../../../providers/classes/referee';
import { RefereeManager } from '../../../providers/manager/referee-manager';
import { AppManager } from '../../../providers/manager/app-manager';

/**
 * Generated class for the ManagerRefereePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-referee',
  templateUrl: 'manager-referee.html',
})
export class ManagerRefereePage {

  nextPage: number = 0;

  page: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  mActionSheetOptions: Array<{ id: number, name: string }> = [];

  mListReferee: Array<Referee> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadActionSheetOptions();

  }

  onLoadData() {
    AppManager.getInstance().sendRequestAPP_GET_LIST_REFEREE();
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.onLoadData();
    }
  }

  numberDidEnter: number = -1;
  ionViewDidEnter() {
    this.numberDidEnter++;
    if (this.numberDidEnter > 0) this.onLoadData();
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerRefereePage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerRefereePage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_REFEREE) {
      this.onParseListRefereeParams(params);
    } else if (cmd == Bd69SFSCmd.APP_DELETE_REFEREE) {
      this.onResponeDeleteReferee(params);
    }
  }

  onResponeDeleteReferee(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.REFEREE_ID);
        let index = this.mListReferee.findIndex(ref => {
          return ref.getRefereeID() == id;
        })
        if (index > -1) {
          this.mListReferee.splice(index, 1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListRefereeParams(params) {
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
          let ListReferee = RefereeManager.getInstance().onParseSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.nextPage < 1) {
            this.mListReferee = [];
            this.mListReferee = ListReferee;
          } else {
            this.mListReferee = this.mListReferee.concat(ListReferee);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickAdd() {
    this.navCtrl.push("ManagerRefereAddPage");
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.nextPage = 0;
        this.page = 0;
        this.oldSearchQuery = this.searchQuery;
      }
      if (this.nextPage == -1) return;
      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_GET_LIST_REFEREE(this.searchQuery, this.nextPage);
        })
      } else {
        AppManager.getInstance().sendRequestAPP_GET_LIST_REFEREE(this.searchQuery, this.nextPage);
      }

    }
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      // { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Huỷ làm trọng tài" }
    ];
  }

  onClickItem(referee: Referee) {
    this.mAppModule.showActionSheet(referee.getName(), this.mActionSheetOptions, (id) => {
      if (id) {
        if (id == 1) {
          AppManager.getInstance().sendRequestAPP_GET_REFEREE_INFO(referee.getRefereeID());
        } else {
          this.mAppModule.showLoading().then(() => {
            AppManager.getInstance().sendRequestAPP_DELETE_REFEREE(referee.getRefereeID());
          });
        }
      }
    })
  }
}
