import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Clubs } from '../../providers/classes/clubs';
import { Leader } from '../../components/info-club-request/info-club-request';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Leagues } from '../../providers/classes/league';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Player } from '../../providers/classes/player';
import { RoleInClub } from '../../providers/manager/constant-manager';
import { JoinLeagueRequest } from '../../providers/classes/joinleaguerequest';
import { ClubInLeague } from '../../providers/classes/clubinleague';

/**
 * Generated class for the Bd69SignLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-sign-league',
  templateUrl: 'bd69-sign-league.html',
})
export class Bd69SignLeaguePage {
  mtext: string = "Gửi yêu cầu";
  mode: number = 0;
  presentName: string = "";
  mClubSelected: Clubs = new Clubs();
  mLeaderSelected: Player = new Player();

  mListClubs: Array<Clubs> = [];
  mListLeaders: Array<Player> = [];

  mLeague: Leagues = new Leagues();

  mRequestJoinLeague: JoinLeagueRequest = new JoinLeagueRequest();

  constructor(
    private mViewController: ViewController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.mClubSelected.setName("Chọn câu lạc bộ");

    Bd69SFSConnector.getInstance().addListener("Bd69SignLeaguePage", respone => {
      this.onExtensionRepone(respone);
    })

    this.onLoadParams();
    
  }

  onExtensionRepone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_USER_IN_CLUB) {
      this.onParsePlayerInClub(params);
      this.mAppModule.hideLoading();
    }

    if (cmd == Bd69SFSCmd.REQUEST_JOIN_LEAGUE) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
        this.mRequestJoinLeague.fromSFSObject(info);
        this.onRequestSucess();
      }else{
      }
      this.mAppModule.hideLoading();

    }

    if(cmd == Bd69SFSCmd.ADD_CLUB_INTO_LEAGUE){
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
        let newClubInLeague = new ClubInLeague();
        newClubInLeague.onFromSFSobject(info);
        this.mViewController.dismiss(newClubInLeague);
      }else{
      }
      this.mAppModule.hideLoading();
    }
  }

  onParsePlayerInClub(params) {
    let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
    if (sfsArray) {
      let array: Array<Player> = [];
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsdata = sfsArray.getSFSObject(i);
        let newPlayer = new Player();
        newPlayer.fromSFSObject(sfsdata);
        newPlayer.onResponeSFSObject(sfsdata);
        array.push(newPlayer);
      }
      this.mListLeaders = array.filter(player => {
        return player.getRoleInClub() >= RoleInClub.CAPTAIN;
      })
      let admin = this.mListLeaders.find(player=>{
        return player.getRoleInClub() == RoleInClub.MANAGER;
      })
      this.mLeaderSelected = admin;
    }
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mLeague = params["league"];
      if(params["club"]){
        this.mtext = "Thêm câu lạc bộ";
        this.mode = 1;
        this.mClubSelected = params["club"];
        this.onLoadLeader();
      }else{
        this.onLoadListClub();
      }
      this.mRequestJoinLeague.setLeagueID(this.mLeague.getLeagueID());
    }
  }

  onLoadListClub() {
    this.mListClubs = this.mAppModule.getClubManager().onGetClubManager();
  }

  onLoadLeader() {
    this.mAppModule.getClubManager().sendRequestGetPlayerInClub(this.mClubSelected.getClubID(), -1);
  }

  getInput($event) {
    this.presentName = $event;
  }

  selectedClub() {
    let mArray = [];
    this.mListClubs.forEach(element => {
      mArray.push({
        id: element.getClubID(),
        name: element.getName()
      })
    });
    this.mAppModule.showRadio("Chọn câu lạc bộ", mArray, this.mClubSelected.getClubID(), (res) => {
      if (res) {
        let index = this.mListClubs.findIndex(club => {
          return club.getClubID() == res;
        })
        if (index > -1) {
          this.mClubSelected = this.mListClubs[index];
          this.mAppModule.showLoading();
          this.onLoadLeader();
        }
      }
    })
  }

  selectedLeader() {
    let mArray = [];
    this.mListLeaders.forEach(element => {
      mArray.push({
        id: element.getPlayerID(),
        name: element.getName()
      })
    });
    this.mAppModule.showRadio("Chọn lãnh đội", mArray, this.mLeaderSelected.getPlayerID(), (res) => {
      if (res) {
        let index = this.mListLeaders.findIndex(leader => {
          return leader.getPlayerID() == res;
        })
        if (index > -1) {
          this.mLeaderSelected = this.mListLeaders[index];
        }
      }
    })
  }


  sendRequest() {
    if (this.mClubSelected.getClubID() == -1 || this.mLeaderSelected.getPlayerID() == -1 || !this.presentName || this.presentName.length == 0) {
      this.mAppModule.showToast("Bạn cần chọn câu lạc bộ và nhập tên người đại diện");

    } else {
      this.mAppModule.showLoading();
      this.mRequestJoinLeague.setLeaderID(this.mLeaderSelected.getPlayerID());
      this.mRequestJoinLeague.setClubID(this.mClubSelected.getClubID());
      this.mRequestJoinLeague.setShowman(this.presentName);
      if(this.mode == 0){
        this.mAppModule.getLeagueManager().sendRequestJoinLeague(this.mRequestJoinLeague);
      }else{
        this.mAppModule.getLeagueManager().addClubIntoLeague(this.mRequestJoinLeague);
      }
    }
  }

  onRequestSucess() {
    this.mViewController.dismiss(true);
    // this.navCtrl.push("Bd69ClubinleagueDetailPage", { params: { type: 1, club: this.mClubSelected, leader: this.mLeaderSelected, league: this.mLeague, presentName: this.presentName, role: this.mLeaderSelected.getRoleInClub() } });
  }
}
