import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { RoleInLeague, RequestState, RoleInClub, StateClubInLeague, LeagueState } from '../../../providers/manager/constant-manager';
import { Leagues } from '../../../providers/classes/league';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { JoinLeagueRequest } from '../../../providers/classes/joinleaguerequest';
import { ClubInLeague } from '../../../providers/classes/clubinleague';

/**
 * Generated class for the Bd69ClubInleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-club-inleague',
  templateUrl: 'bd69-club-inleague.html',
})
export class Bd69ClubInleaguePage {

  mListActionSheets: Array<{ id: number, name: string }> = [];

  mListClubs: Array<ClubInLeague> = [];

  numberDidEnter: number = 0;

  mLeagueID: number = -1;

  isLoadingData: boolean = true;


  constructor(
    private mAlertController : AlertController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }


  onLoadParams() {
    if(this.navParams.data["params"]){
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onSelectAddClub() {
    this.navCtrl.push("Bd69AddclubIntoleaguePage", {params: this.mLeagueID});
  }

  onLoadData(){
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_CLUB(this.mLeagueID);
    this.onLoadActionSheet();
  }

  ionViewDidEnter(){
    if(this.numberDidEnter > 0){
      this.onLoadData();
    }
    this.numberDidEnter++;
  }


  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    
    this.mAppModule._LoadAppConfig().then(()=>{
      Bd69SFSConnector.getInstance().addListener("Bd69ClubInleaguePage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
    })
   
  }

  ionViewWillUnload(){
    this.mAppModule.removeSFSListener("Bd69ClubInleaguePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_CLUB) {
      this.onParseClubInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_CLUB) {
      this.onResponeRemoveClubFromLeague(params);
    }

  }

 
  onResponeRemoveClubFromLeague(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubId = content.getInt(ParamsKey.CLUB_ID);
        let index = this.mListClubs.findIndex(club => {
          return club.getClubID() == clubId;
        })
        if (index > -1) {
          this.mAppModule.showToast("Đã xoá câu lạc bộ " + this.mListClubs[index].getName() + " khỏi giải đấu");
          this.mListClubs.splice(index, 1);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeChangeClubStateInLeague(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let clubId = params.getInt(ParamsKey.CLUB_ID);
      let index = this.mListClubs.findIndex(club => {
        return club.getClubID() == clubId;
      })
      if (index > -1) {
        this.mListClubs[index].setState(params.getInt(ParamsKey.STATE));
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onParseClubInLeague(params) {
    this.isLoadingData = false;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if(content.containsKey(ParamsKey.ARRAY)){
          this.mListClubs = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

 
  onLoadActionSheet()
  {
    this.mListActionSheets = [
      { id: 1, name: "Chỉnh sửa thông tin" },
      { id: 2, name: "Xem hồ sơ" },
      { id: 3, name: "Cập nhật lãnh đội" },
      { id: 4, name: "Thêm thành viên" },
      { id: 5, name: "Xoá khỏi giải đấu" }
    ];
  }

  selectClub(item: ClubInLeague) {
    this.mAppModule.showActionSheet(item.getName(), this.mListActionSheets, (id) => {
      if(id){
        if(id == 1){
          this.goToListPlayer(item);
        }else if(id ==2){
          this.goToProfileClub(item);
        }else if(id == 3){
          this.doUpdateClubManager(item);
        } else if(id == 4){
          this.doAddPlayerIntoLeague(item.getClubID());
        }
        else{
          this.doRemoveClub(item);
        }
      }
    });
    
  }

  doAddPlayerIntoLeague(clubID: number){
    this.navCtrl.push("Bd69PlayersInleagueAddnewPage", {params: {leagueID: this.mLeagueID, clubID: clubID}});
  }

  doUpdateClubManager(club: ClubInLeague){
    this.navCtrl.push("Bd69ClubInleagueUpdatemanagerPage", {params: {leagueID: this.mLeagueID, clubID: club.getClubID()}});
  }

  doRemoveClub(club: ClubInLeague){
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setMessage("Bạn muốn xóa đội bóng " + club.getName() +" khỏi giải đấu");
    alert.addButton({
      text: "Không"
    });
    alert.addButton({
      text: "Xóa",
      handler : ()=>{
        this.mAppModule.showLoading().then(()=>{
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_REMOVE_CLUB(club.getClubID(),this.mLeagueID);
        })
      }
    });
    alert.present();
    
  }
  
  goToListPlayer(item: ClubInLeague) {
    this.navCtrl.push("Bd69ClubInleagueUpdatePage", { params: { leagueID: this.mLeagueID, clubID: item.getClubID() } });
  }

  goToProfileClub(item: ClubInLeague) {
    this.navCtrl.push("Bd69ClubinleagueDetailPage", { params: { leagueID: this.mLeagueID, clubID: item.getClubID(), type: 1 } });
  }

  doRefresh(refresher) {
    
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }
}
