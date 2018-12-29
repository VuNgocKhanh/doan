import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Clubs } from '../../providers/classes/clubs';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from "../../providers/classes/paramkeys";
import { RoleInClub } from '../../providers/manager/constant-manager';

export interface ItemStatistic {
  id: number;
  icon: string;
  name: string;
  detail: string;
  color: string;
}

@IonicPage()
@Component({
  selector: 'page-club-info',
  templateUrl: 'club-info.html',
})
export class ClubInfoPage {

  club_info = "Thông tin câu lạc bộ";

  mClub: Clubs = new Clubs();

  notify: boolean = true;

  mRoleOfUser: number = RoleInClub.GUEST;

  mClubMenu: Array<ItemStatistic> = [
    { id: 1, icon: "bd69-member2", name: "Thành viên", detail: "0", color: "orange-color" },
    { id: 2, icon: "bd69-league", name: "Giải đấu đã tham gia", detail: "0", color: "green-color" },
    { id: 3, icon: "bd69-notify2", name: "Thông báo", detail: "Bật", color: "blue-color" },
    // { id: 4, icon: "bd69-logout", name: "Rời khỏi câu lạc bộ", detail: null, color: "red-color" }
  ]

  leave_club = "Rời khỏi câu lạc bộ";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mAlertController: AlertController,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.onLoadData();
    Bd69SFSConnector.getInstance().addListener("ClubInfoPage", response => {
      this.onExtensionResponse(response)
    });
    this.mAppModule.getUserManager().sendRequestGetClubInfo(this.mClub.getClubID());
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (cmd == Bd69SFSCmd.GET_CLUB_INFO) {
      this.onResponseGetClubInfo(params);
    }
    else if (cmd == Bd69SFSCmd.LEAVE_CLUB) {
      this.onResponseLeaveClub(params);
    }
  }

  onResponseGetClubInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.mClub.fromSFSobject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
        let club = this.mAppModule.getClubManager().getClubByID(this.mClub.getClubID());
        if (club) {
          club.fromObject(this.mClub);
        } else {
          this.mAppModule.getClubManager().addClub(this.mClub); 
        }

        this.mRoleOfUser = this.mClub.getRoleOfUser();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponseLeaveClub(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubID = params.getInt(ParamsKey.CLUB_ID);
        let userID = params.getInt(ParamsKey.PLAYER_ID);
        if (userID == this.mAppModule.getUserManager().getUser().getUserID()) {
          this.mAppModule.getClubManager().removeClub(clubID);
          this.mAppModule.getUserManager().getUser().getUserStatistic().setNumberClub(this.mAppModule.getUserManager().getUser().getUserStatistic().getNumberClub() - 1);
        }

      }
      this.navCtrl.popToRoot();
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadData() {
    if (this.navParams.get('params')) {
      this.mClub.setClubID(this.navParams.get('params'));
      this.mClub.fromObject(this.mAppModule.getClubManager().getClubByID(this.mClub.getClubID()));
      this.mRoleOfUser = this.mClub.getRoleOfUser();
    }
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("Bd69AddClubPage");
  }

  turnNotify() {
    this.notify = !this.notify;
  }

  onClickLeaveClub() {
    let alert = this.mAlertController.create();
    alert.setTitle("Rời khỏi câu lạc bộ?");
    alert.setMessage("Hãy chắc chắn rằng bạn muốn thực hiện thao tác này. ");
    alert.addButton("Cancel");
    alert.addButton({
      text: "Ok",
      handler: () => {
        this.requestLeaveClub();
      }
    });
    alert.present();
  }

  requestLeaveClub() {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getClubManager().sendRequestLeaveClub(this.mClub.getClubID());
    });
  }


}
