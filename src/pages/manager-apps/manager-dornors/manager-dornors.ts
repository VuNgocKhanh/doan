import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Dornor } from '../../../providers/classes/donnor';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { AppManager } from '../../../providers/manager/app-manager';
import { ConstantManager } from '../../../providers/manager/constant-manager';

/**
 * Generated class for the ManagerDornorsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface ListModels {
  dornor: Dornor;
  checked: boolean;
}

@IonicPage()
@Component({
  selector: 'page-manager-dornors',
  templateUrl: 'manager-dornors.html',
})
export class ManagerDornorsPage {
  mListFillter: Array<{ id: number, name: string }> = [];
  mListDornors: Array<Dornor> = [];
  mIDSelected: number = -1;
  mListModels: Array<ListModels> = [];

  load: number = -1;
  nextPage: number = 0;

  page: number = 0;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  mActionSheetOptions: Array<{ id: number, name: string }> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController) {
    this.onLoadActionSheetOptions();
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerDornorsPage", respone => {
        this.onExtensionRespone(respone);
      });
    });

    this.onLoadData();

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerDornorsPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if (cmd == Bd69SFSCmd.GET_LIST_DORNOR) {
      this.onParseListDornorParams(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_DORNOR) {
      this.onParseListDornorParams(params);
    }
    else if (cmd == Bd69SFSCmd.SEARCH_DORNOR) {
      this.onParseListDornorParams(params);
    }
    else if (cmd == Bd69SFSCmd.APP_DELETE_DORNOR) {
      this.onResponeDeleteDornors(params);
    } else if (cmd == Bd69SFSCmd.APP_GET_LIST_DORNOR) {
      this.onParseListDornorParams(params);
    } else if (cmd == Bd69SFSCmd.APP_UPDATE_DORNOR_INFO) {
      this.onResponeUpdateDornors(params);
    }
  }

  onResponeUpdateDornors(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Cập nhật thành công");
    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeDeleteDornors(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.DORNOR_ID);
        let index = this.mListDornors.findIndex(dor => {
          return dor.getDornorID() == id;
        })
        if (index > -1) {
          this.mListDornors.splice(index, 1);
        }
      }
      this.mAppModule.showToast("Xóa nhà tài trợ thành công");
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListDornorParams(params) {

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
          // let mDornors = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          let mDornors = this.mAppModule.getLeagueManager().onResponeDornorSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.page < 1) {
            this.mListDornors = [];
            this.mListDornors = mDornors;
          } else {
            this.mListDornors = this.mListDornors.concat(mDornors);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      { id: 1, name: "Cập nhật thông tin" },
      { id: 2, name: "Hủy nhà tài trợ" }
    ];
  }

  clearQuery() {
    this.searchQuery = "";
    this.onLoadData();
  }

  onClickDornor(dornor: Dornor) {
    this.mAppModule.showActionSheet(dornor.getName(), ConstantManager.getInstance().getOptionForManagerDornor(), (res) => {
      this.onSelectAction(res, dornor);
    })
  }

  onSelectAction(res, dornor: Dornor) {
    if (res == 0) {
      this.onEditName(dornor);
    } else if (res == 1) {
      this.onEditLogo(dornor);
    } else if (res == 2) {
      this.onEditDescription(dornor);
    } else if (res == 3) {
      this.onEditWebsite(dornor);
    } else if (res == 4) {
      this.onEditFacebook(dornor);
    } else if (res == 5) {
      this.onEditYoutube(dornor);
    } else if (res == 6) {
      AppManager.getInstance().sendRequestAPP_DELETE_DORNOR(dornor.getDornorID());
    } else if(res == 7){
      this.goToInfoDornor(dornor.getDornorID());
    }
  }

  goToInfoDornor(id: number){
    this.navCtrl.push("ManagerDornorsAddPage", {params: id});
  }

  onEditLogo(dornor: Dornor) {

    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: dornor.getLogo(), type: 1 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_UPDATE_LOGO_DORNOR(dornor.getDornorID(), url);
        });
      }
    });
  }

  onEditName(dornor: Dornor) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật tên nhà tài trợ");
    alert.setSubTitle(dornor.getName());
    alert.addInput({
      type: "text",
      value: dornor.getName(),
      name: "dornorName"
    });
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.dornorName.trim() == "") {
          this.mAppModule.showToast("Tên câu nhà tài trợ không thể bỏ trống");
          return;
        }
        dornor.setName(data.dornorName);
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_UPDATE_NAME_DORNOR(dornor.getDornorID(), dornor.getName());
        })
      }
    });
    alert.present();
  }

  onEditDescription(dornor: Dornor) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật mô tả");
    alert.setSubTitle(dornor.getDescription());
    alert.addInput({
      type: "text",
      value: dornor.getDescription(),
      name: "dornorDescription"
    });
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.dornorDescription.trim() == "") {
          return;
        }
        dornor.setDescription(data.dornorDescription);
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_UPDATE_DESCRIPTION_DORNOR(dornor.getDornorID(), dornor.getDescription());
        })
      }
    });
    alert.present();
  }

  onEditWebsite(dornor: Dornor) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật website");
    alert.setSubTitle(dornor.getWebsite());
    alert.addInput({
      type: "text",
      value: dornor.getWebsite(),
      name: "dornorWebsite"
    });
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.dornorWebsite.trim() == "") {
          return;
        }
        dornor.setWebsite(data.dornorWebsite);
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_UPDATE_WEBSITE_DORNOR(dornor.getDornorID(), dornor.getWebsite());
        })
      }
    });
    alert.present();
  }

  onEditFacebook(dornor: Dornor) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật facebook");
    alert.setSubTitle(dornor.getFacebook());
    alert.addInput({
      type: "text",
      value: dornor.getFacebook(),
      name: "dornorFacebook"
    });
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.dornorFacebook.trim() == "") {
          return;
        }
        dornor.setFacebook(data.dornorFacebook);
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_UPDATE_FACEBOOK_DORNOR(dornor.getDornorID(), dornor.getFacebook());
        })
      }
    });
    alert.present();
  }

  onEditYoutube(dornor: Dornor) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật youtube");
    alert.setSubTitle(dornor.getYoutube());
    alert.addInput({
      type: "text",
      value: dornor.getYoutube(),
      name: "dornorYoutube"
    });
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.dornorYoutube.trim() == "") {
          return;
        }
        dornor.setYoutube(data.dornorYoutube);
        this.mAppModule.showLoading().then(() => {
          AppManager.getInstance().sendRequestAPP_UPDATE_YOUTUBE_DORNOR(dornor.getDornorID(), dornor.getYoutube());
        })
      }
    });
    alert.present();
  }

  onLoadData() {
    this.onLoadDornors();
    this.onLoadFillterOptions();
  }

  onLoadFillterOptions() {
    this.mListFillter = [
      { id: -1, name: "Kim cương" },
      { id: 0, name: "Vàng" },
      { id: 1, name: "Bạc" },
      { id: 2, name: "Đồng" }
    ];
  }

  onClickAdd() {

    this.mAppModule.showModalIonic("ManagerDornorsAddPage", null, (dornor) => {
      // this.load = 1;
      if (dornor) {
        this.mListModels.unshift({
          dornor: dornor,
          checked: false
        });
        this.onLoadDornors();
      }
    })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }


  onClickSearch() {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.oldSearchQuery = this.searchQuery;
        this.page = 0;
        this.nextPage = 0;
      }
      if (this.nextPage == -1) return;


      this.mAppModule.showLoading().then(() => {
        this.mAppModule.doLogConsole("dem", "loading...");
        this.mAppModule.getLeagueManager().sendRequestSearchDonor(this.searchQuery, this.nextPage);
      })
    }
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.onLoadData();
    }
  }

  onLoadDornors() {
    /**Send request get league of system */
    AppManager.getInstance().sendRequestAPP_GET_LIST_DORNOR(this.nextPage);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onLoadDornors();
      infiniteScroll.complete();
    }, 500);
  }
}
