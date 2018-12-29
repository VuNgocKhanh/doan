import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Clubs } from '../../../providers/classes/clubs';
import { ConstantManager } from '../../../providers/manager/constant-manager';
import { AppManager } from '../../../providers/manager/app-manager';

/**
 * Generated class for the ManagerClubsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-clubs',
  templateUrl: 'manager-clubs.html',
})
export class ManagerClubsPage {

  searchQuery: string = "";

  oldSearchKey: string = "";

  nextPage: number = 0;

  page: number = 0;

  listClub: Array<Clubs> = [];

  numberDidEnter: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController
  ) {
  }

  onLoadData() {
    AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB(this.searchQuery, this.nextPage);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerClubsPage", response => {
        this.onExtensionResponse(response);
      });

      this.onLoadData();
    });

  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onLoadData();
    }
    this.numberDidEnter++;

  }

  ionViewWillUnLoad() {
    Bd69SFSConnector.getInstance().removeListener("ManagerClubsPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_CLUB) {
      this.onExtensionParamsListClub(params);
    }
    else if (cmd == Bd69SFSCmd.APP_DELETE_CLUB) {
      this.onExtensionParamsDeleteClub(params);
    }
    else if (cmd == Bd69SFSCmd.APP_UPDATE_CLUB_INFO) {
      this.onExtensionParamsUpdateClub(params);
    }
  }


  onExtensionParamsListClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ARRAY)) {
        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.nextPage = -1;
        }

        this.page = content.getInt(ParamsKey.PAGE);
        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        let listClub = this.mAppModule.getClubManager().onParseSFSArray(sfsArray);

        if (this.page < 1) {
          this.listClub = listClub;
        } else {
          this.listClub = this.listClub.concat(listClub);
        }
      }
    }
    this.mAppModule.hideLoading();
  }

  onExtensionParamsDeleteClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      let clubID = content.getInt(ParamsKey.CLUB_ID);
      let index = this.listClub.findIndex(club => {
        return club.getClubID() == clubID;
      })

      if (index > -1) {
        this.listClub.splice(index, 1);
        this.mAppModule.showToast("Xóa câu lạc bộ khỏi hệ thống thành công");
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionParamsUpdateClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      let clubID = content.getInt(ParamsKey.CLUB_ID);
      let index = this.listClub.findIndex(club => {
        return club.getClubID() == clubID;
      })

      if (index > -1) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.listClub[index].fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.mAppModule.showToast("Cập nhật câu lạc bộ thành công");
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickClub(club: Clubs) {
    this.mAppModule.showActionSheet(club.getName(), ConstantManager.getInstance().getOptionForManagerClub(), (res) => {
      this.onSelectAction(res, club);
    })
  }

  onSelectAction(res, club: Clubs) {
    if (res == 0) {
      this.navCtrl.push("ViewClubPage", { params: { clubID: club.getClubID() } })
    } else if (res == 1) {
      this.onEditClubName(club);
    } else if (res == 2) {
      this.onUpdateLogo(club);
    } else if (res == 3) {
      this.onUpdateCover(club);
    } else if (res == 4) {
      this.onSetManagerClub(club);
    } else if (res == 5) {
      this.onAddMember(club);
    } else if (res == 6) {
      this.onDeleteClub(club);
    }
  }

  onClickSearch() {
    this.nextPage = 0;
    if (this.nextPage == -1) return;
    this.mAppModule.showLoading().then(() => {
      AppManager.getInstance().sendRequestAPP_GET_LIST_CLUB(this.searchQuery, this.nextPage);
    })
  }

  onClickCreateClub() {
    this.navCtrl.push("Bd69AddClubPage");
  }

  onEditClubName(club: Clubs) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật tên câu lạc bộ");
    alert.setSubTitle(club.getName());
    alert.addInput({
      type: "text",
      value: club.getName(),
      name: "clubName"
    });
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.clubName.trim() == "") {
          this.mAppModule.showToast("Tên câu lạc bộ không thể bỏ trống");
          return;
        }
        club.setName(data.clubName);
        AppManager.getInstance().sendRequestAPP_UPDATE_NAME_CLUB(club.getClubID(), club.getName());
      }
    });
    alert.present();
  }

  onUpdateLogo(club: Clubs) {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: club.getLogo(), type: 1 } }, (url) => {
      if (url) {
        AppManager.getInstance().sendRequestAPP_UPDATE_LOGO_CLUB(club.getClubID(), url);
      }
    })
  }

  onUpdateCover(club: Clubs) {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: club.getCover(), type: 2 } }, (url) => {
      if (url) {
        AppManager.getInstance().sendRequestAPP_UPDATE_COVER_CLUB(club.getClubID(), url);
      }
    })
  }

  onSetManagerClub(club: Clubs) {
    this.navCtrl.push("ManagerClubsAddmanagerPage", { params: club.getClubID() });
  }

  onAddMember(club: Clubs) {
    this.navCtrl.push("ManagerClubsAddmemberPage", { params: club.getClubID() });
  }

  onDeleteClub(club: Clubs) {
    this.mAppModule.showAlert("Xóa câu lạc bộ " + club.getName(), (res) => {
      if (res == 1) {
        AppManager.getInstance().sendRequestAPP_DELETE_CLUB(club.getClubID());
      }
    })
  }

  onClearQuery() {
    this.nextPage = 0;
    this.onLoadData();
  }


  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onLoadData();
      infiniteScroll.complete();
    }, 1000);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.nextPage = 0;
      this.onLoadData();

      refresher.complete();
    }, 1500);
  }
}
