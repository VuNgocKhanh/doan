import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Stadium } from '../../../providers/classes/stadium';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { AppManager } from '../../../providers/manager/app-manager';
import { ConstantManager } from '../../../providers/manager/constant-manager';

/**
 * Generated class for the ManagerStadiumsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-stadiums',
  templateUrl: 'manager-stadiums.html',
})
export class ManagerStadiumsPage {

  nextPage: number = 0;
  page: number = 0;

  searchKey: string = "";

  listStadium: Array<Stadium> = [];

  numberDidEnter: number = -1;

  loadType: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController
  ) {
  }

  // onLoadData() {
  //   this.onLoadStadium();
  // }

  onLoadStadium() {
    this.loadType = 0;
    AppManager.getInstance().sendRequestAPP_GET_LIST_STADIUM(this.nextPage);
  }

  onSearchStadium() {
    this.loadType = 1;
    this.mAppModule.getLeagueManager().sendRequestSearchStadium(this.searchKey, this.nextPage);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerStadiumsPage", response => {
        this.onExtentionResponse(response);
      });
    });
    this.onLoadStadium();
  }

  ionViewWillUnLoad() {
    Bd69SFSConnector.getInstance().removeListener("ManagerStadiumsPage");
  }

  onExtentionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.APP_GET_LIST_STADIUM) {
      this.onExtentionResponseStadiumArray(params);
    } else if (cmd == Bd69SFSCmd.SEARCH_STADIUM) {
      this.onExtentionResponseStadiumArray(params);
    } else if (cmd == Bd69SFSCmd.APP_DELETE_STADIUM) {
      this.onExtentionResponseDeleteStadium(params);
    } else if (cmd == Bd69SFSCmd.APP_UPDATE_STADIUM_INFO) {
      this.onExtentionResponseUpdateStadium(params);
    }
  }

  onExtentionResponseStadiumArray(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.NEXT)) {
        this.nextPage = content.getInt(ParamsKey.NEXT);
      }
      if (content.containsKey(ParamsKey.PAGE)) {
        this.page = content.getInt(ParamsKey.PAGE);
      }
      if (content.containsKey(ParamsKey.ARRAY)) {
        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        let listStadium: Array<Stadium> = [];

        for (let i = 0; i < sfsArray.size(); i++) {
          let sfsObject = sfsArray.getSFSObject(i);
          let newStadium = new Stadium();
          newStadium.fromSFSobject(sfsObject);

          listStadium.push(newStadium);
        }

        if (this.page < 1) {
          this.listStadium = listStadium;
        } else {
          this.listStadium = this.listStadium.concat(listStadium);
        }
      }
    }
  }

  onExtentionResponseDeleteStadium(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      let stadiumID = content.getInt(ParamsKey.STADIUM_ID);

      let index = this.listStadium.findIndex(item => {
        return item.getStadiumID() == stadiumID
      })

      if (index > -1) {
        this.listStadium.splice(index, 1);
        this.mAppModule.showToast("Xóa sân bóng khỏi hệ thống thành công");
      }
    }
  }

  onExtentionResponseUpdateStadium(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      let stadiumID = content.getInt(ParamsKey.STADIUM_ID);

      let newStadium = new Stadium();
      newStadium.fromSFSobject(content.getSFSObject(ParamsKey.INFO));

      let index = this.listStadium.findIndex(item => {
        return item.getStadiumID() == stadiumID
      });

      if (index > -1) {
        this.listStadium[index] = newStadium;
      }
    }
  }



  onClickSearch() {
    this.nextPage = 0;
    if (this.searchKey.trim().length > 0) {
      if (this.nextPage == -1) return;
      this.mAppModule.showLoading().then(() => {
        this.onSearchStadium();
      })
    }

  }

  onClearQuer() {
    // this.listStadium = [];
  }

  onClickStadium(stadium: Stadium) {
    let actionSheet = [
      { id: 0, name: "Xem thông tin" },
      { id: 1, name: "Đổi tên sân bóng" },
      { id: 2, name: "Cập nhật địa chỉ" },
      { id: 3, name: "Xóa" }
    ]
    this.mAppModule.showActionSheet(stadium.getName(), actionSheet, ((res) => {
      this.onSelectAction(res, stadium);
    }))
  }

  onSelectAction(res, stadium: Stadium) {
    if (res == 0) {
      this.onClickViewStadium(stadium);
    } else if (res == 1) {
      this.onUpdateStadium(stadium, res);
    } else if (res == 2) {
      this.onUpdateStadium(stadium, res);
    } else if (res == 3) {
      this.onClickDeleteStadium(stadium);
    }
  }

  onClickViewStadium(stadium: Stadium) {
    this.mAppModule.showModalIonic("StadiumDetailPage", { stadiumID: stadium.getStadiumID() });
  }

  onClickDeleteStadium(stadium: Stadium) {
    AppManager.getInstance().sendRequestAPP_DELETE_STADIUM(stadium.getStadiumID());
  }

  onClickAddStadium() {
    this.mAppModule.showModalIonic("ManagerStadiumsAddstadiumPage", null, (res) => {
      if (res) {
        this.listStadium.unshift(res);
      }
    });
  }

  onUpdateStadium(stadium: Stadium, res: number) {
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật thông tin sân bóng");
    if (res == 1) {
      alert.setSubTitle(stadium.getName());
      alert.addInput({
        type: "text",
        value: stadium.getName(),
        name: "stadiumValue"
      });
    } else if (res == 2) {
      alert.addInput({
        type: "text",
        value: stadium.getAddress(),
        name: "stadiumValue"
      });
    }
    alert.addButton({
      text: "Huỷ"
    });
    alert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.stadiumValue.trim() == "" && res == 1) {
          this.mAppModule.showToast("Tên sân vận động không thể bỏ trống");
          return;
        } else if (data.stadiumValue.trim() == "" && res == 2) {
          this.mAppModule.showToast("Địa chỉ sân vận động không thể bỏ trống");
          return;
        }

        if (res == 1) {
          stadium.setName(data.stadiumValue);
          AppManager.getInstance().sendRequestAPP_UPDATE_STADIUM_INFO_NAME(stadium.getStadiumID(), stadium);
        } else if (res == 2) {
          stadium.setAddress(data.stadiumValue);
          AppManager.getInstance().sendRequestAPP_UPDATE_STADIUM_INFO_ADDRESS(stadium.getStadiumID(), stadium);
        }

      }
    });
    alert.present();
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {

      if (this.loadType == 0) {
        this.onLoadStadium();
      } else if (this.loadType == 1) {
        this.onSearchStadium();
      }

      infiniteScroll.complete();
    }, 1000);
  }

  doRefresh(refresher) {
    setTimeout(() => {

      this.nextPage = 0;

      this.onLoadStadium();
      if (this.loadType == 0) {
        this.onLoadStadium();
      } else if (this.loadType == 1) {
        this.onSearchStadium();
      }

      refresher.complete();
    }, 1500);
  }



}