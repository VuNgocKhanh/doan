import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, ViewController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { User } from '../../../providers/classes/user';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { AppManager } from '../../../providers/manager/app-manager';

/**
 * Generated class for the ManagerClubsAddmemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-clubs-addmember',
  templateUrl: 'manager-clubs-addmember.html',
})
export class ManagerClubsAddmemberPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  clubID: number = -1;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  mListUser: Array<User> = [];

  mListActionSheet: Array<{ id: number, name: string }> = [];

  isAddMember: boolean = false;

  numberAdd: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
    this.onLoadParams();
    this.onLoadActionSheet();
  }


  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.clubID = this.navParams.get("params");
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mSearchBar.setFocus();
    }, 1000);
  }

  onLoadActionSheet() {
    this.mListActionSheet = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Thêm vào đội bóng" }
    ];
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerClubsAddmemberPage", respone => {
        this.onExtensionResponse(respone);
      });
    });
  }


  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerClubsAddmemberPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.onParseListUserParams(params);
    } else if (cmd == Bd69SFSCmd.ADD_USER_INTO_CLUB) {
      this.onResponeAddUser(params);
    }
  }

  onResponeAddUser(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.numberAdd ++;

        let dismisInfo = {
          add: this.numberAdd,
          clubID: this.clubID
        }
        this.mAppModule.showToast("Thêm thành viên thành công");
        this.mViewController.dismiss(dismisInfo);
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }



  onParseListUserParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        }
        if (content.containsKey(ParamsKey.PAGE)) {
          this.page = content.getInt(ParamsKey.PAGE);
        }

        if (content.containsKey(ParamsKey.ARRAY)) {
          let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
          for (let i = 0; i < sfsArray.size(); i++) {
            let sfsObject = sfsArray.getSFSObject(i);
            let newUser = new User();
            newUser.fromSFSObject(sfsObject);

            this.mListUser.push(newUser);
          }
        }
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
  }

  onClickSearch() {
    this.nextPage = 0;
    if (this.nextPage == -1) return;
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
    })
  }

  onClickUser(user: User) {
    this.mAppModule.showActionSheet(user.getName(), this.mListActionSheet, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(user);
        } else {
          this.doAddUser(user);
        }
      }
    })
  }

  goToProfileUser(user) {

  }

  doAddUser(user: User) {
    this.mAppModule.getClubManager().sendRequestAddUserIntoClub(user.getUserID(), this.clubID);
  }

  onAddMemberDone() {
    this.mViewController.dismiss(1);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.nextPage > this.page) {

        this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
      }

      infiniteScroll.complete();
    }, 200);
  }

}
