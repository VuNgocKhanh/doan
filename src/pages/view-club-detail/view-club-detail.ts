import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Clubs } from '../../providers/classes/clubs';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';

/**
 * Generated class for the ViewClubDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-club-detail',
  templateUrl: 'view-club-detail.html',
})
export class ViewClubDetailPage {

  manager_club = "Quản lý câu lạc bộ"

  list_member = "Danh sách thành viên";
  request_join = "yêu cầu tham gia";
  number_of_request: number = 0;

  league_join = "giải đấu đang tham gia";
  number_of_league: number = 0;

  league = "Giải đấu";
  album = "Ảnh & Video";
  photo = "ảnh";
  video = "video";
  and = "và";
  profile = "Hồ sơ";
  info = "Chỉnh sửa thông tin";

  clubID: number = -1;
  mClub: Clubs = new Clubs();

  isDidEnter: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  onLoadParam() {
    if (this.navParams.get('params')) {
      this.clubID = this.navParams.get('params');
    }
  }

  onLoadData(){
    this.mAppModule.getUserManager().sendRequestGetClubInfo(this.clubID);
    this.mAppModule.getUserManager().getListLeagueOfClub(this.clubID);
  }

  ionViewDidLoad() {
    this.onLoadParam();
    Bd69SFSConnector.getInstance().addListener("ViewClubDetailPage", response => {
      this.onExtensionRespone(response);
    });
    this.onLoadData();
  }

  ionViewDidEnter(){
    if(this.isDidEnter > 0){
      this.onLoadData();
    }
    this.isDidEnter++;
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("ViewClubDetailPage");
  }



  onExtensionRespone(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (cmd == Bd69SFSCmd.GET_LIST_LEAGUE_OF_CLUB) {
      this.onResponeGetListLeagueOfClub(params);
    } else if (cmd == Bd69SFSCmd.GET_CLUB_INFO) {
      this.onResponeGetClubInfo(params);
    }
  }

  onResponeGetListLeagueOfClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ARRAY)) {
        this.number_of_league = content.getSFSArray(ParamsKey.ARRAY).size();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetClubInfo(params) {

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mClub.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          let club = this.mAppModule.getClubManager().getClubByID(this.mClub.getClubID());
          if (club) {
            club.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }


  onClickListMember() {
    this.navCtrl.push("ManagerMemberPage", { params: { clubID: this.clubID, role: 2 } });
  }
  onClickLeagueJoin() {
    this.navCtrl.push("LeagueClubJoinPage", { params: this.clubID });
  }

  onClickPhoto() {
    this.navCtrl.push("DevelopPage", { title: "Ảnh & Video" });
  }

  onClickProfile() {
    this.navCtrl.push("DevelopPage", { title: "Hồ sơ" });
  }

  onClickEditClub() {
    this.navCtrl.push("EditClubPage", { params: this.mClub .getClubID()});
  }

  doRefresh(refresher) {
    this.mAppModule.getUserManager().sendRequestGetClubInfo(this.clubID);
    this.mAppModule.getClubManager().sendRequestGetUserRequestInClub(this.clubID);
    this.mAppModule.getUserManager().getListLeagueOfClub(this.clubID);

    setTimeout(() => {

      refresher.complete();
    }, 2000);
  }

}
