import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Clubs } from '../../providers/classes/clubs';
import { Player } from '../../providers/classes/player';
import { RoleInClub, ConstantManager, SEARCH_TYPE } from '../../providers/manager/constant-manager';
import { User } from '../../providers/classes/user';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Leagues } from '../../providers/classes/league';
import { AppManager } from '../../providers/manager/app-manager';

/**
 * Generated class for the ViewClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-club',
  templateUrl: 'view-club.html',
})
export class ViewClubPage {
  mClub: Clubs = new Clubs();
  mRole: number = 0;
  role: number = RoleInClub.MEMBER;
  manager_tool = "Công cụ của nhà quản trị";
  request_join = "Yêu cầu tham gia";
  list_member = "Danh sách thành viên";
  view_more = "xem thêm";
  member: string = "Thành viên";
  accept = "Xác nhận";
  delete = "Xóa";
  btn_join: string = "Gửi yêu cầu tham gia";

  type: number = -1;

  listLeagueJoin: Array<Leagues> = [];
  stateOfRequest: boolean = false;
  mShowLoading: boolean = true;

  mListUser: Array<User> = [];
  menuList: Array<{ id: number, name: string, description: string, icon: string, color: string, page: string, badge: number, title?: string }> = [
    { id: 0, name: "Thành viên", description: "", icon: "bd69-group", color: "#f88d00", page: "ManagerMemberPage", badge: 0 },
    { id: 1, name: "Giải đấu", description: "", icon: "bd69-trophy", color: "#0cb83f", page: "LeagueClubJoinPage", badge: 0 },
    { id: 2, name: "Ảnh&Video", description: "", icon: "bd69-image", color: "#3b7dff", page: "DevelopPage", badge: 0, title: "Ảnh & Video" }
  ];

  menuIDSelected: number = 0;
  page: number = 0;

  constructor(
    public mEvent: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mClub.setClubID(params["clubID"]);
      if (params["role"]) {
        this.mRole = params["role"];
      }
    }
  }

  onLoadData() {
    AppManager.getInstance().sendRequestAPP_GET_CLUB_INFO(this.mClub.getClubID());
    this.mAppModule.getClubManager().sendRequestGetPlayerInClub(this.mClub.getClubID());
    this.mClub.fromObject(this.mAppModule.getClubManager().getClubByID(this.mClub.getClubID()));
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("", response => {
        this.onExtensionRespone(response);
      });
      this.onLoadData();
    });
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("ViewClubPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_USER_IN_CLUB) {
      this.onResponseGetUserInClub(params);
    } else if (cmd == Bd69SFSCmd.GET_CLUB_INFO) {
      // this.onResponseGetClubInfo(params);
    } else if (cmd == Bd69SFSCmd.UPDATE_CLUB_INFO) {
      this.onResponseUpdateClubInfo(params);
    }

    else if (cmd == Bd69SFSCmd.APP_GET_CLUB_INFO) {
      this.onResponseGetClubInfo(params);
    }
  }


  onResponseGetUserInClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ARRAY)) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        this.mClub.setListPlayer(this.mAppModule.getPlayerManager().onParsePlayer(params, clubID));
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponseUpdateClubInfo(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mClub.fromSFSobject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
      let club = this.mAppModule.getClubManager().getClubByID(this.mClub.getClubID());
      if (club) {
        club.fromSFSobject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponseGetClubInfo(params) {

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ROLE)) {
        this.role = content.getInt(ParamsKey.ROLE);
        this.mClub.setRoleOfUser(this.role);
      }
      this.mClub.fromSFSobject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
      let club = this.mAppModule.getClubManager().getClubByID(this.mClub.getClubID());
      if (club) {
        club.fromSFSobject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
      } else {
        this.mAppModule.getClubManager().addClub(this.mClub);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }


  onClickItem(menu) {
    if (menu.id == 0) {
      this.onClickListPlayer();
    } else {
      if (menu.id == 2) {
        this.navCtrl.push(menu.page, { title: menu.title })
      } else {
        this.mClub.setRoleOfUser(this.role);
        this.navCtrl.push(menu.page, { params: this.mClub.getClubID() });
      }
    }
  }

  goToSearchPage() {
    this.navCtrl.push("Bd69SearchPage", { params: SEARCH_TYPE.CLUB });
  }

  onClickClubInfo() {
    this.navCtrl.push("ClubInfoPage", { params: this.mClub.getClubID() });
  }

  onClickListPlayer() {
    this.navCtrl.push("ManagerMemberPage", { params: { clubID: this.mClub.getClubID(), role: this.mRole } });
  }

  onClickCameraCover() {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mClub.getCover(), type: 2 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getClubManager().sendRequestUpdateClubCover(this.mClub.getClubID(), url);
        });
      }
    })
  }

  onClickCameraLogo() {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mClub.getLogo(), type: 1 } }, (url) => {
      if (url) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getClubManager().sendRequestUpdateClubLogo(this.mClub.getClubID(), url);
        });
      }
    })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }

}
