import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Player } from '../../providers/classes/player';
import { Clubs } from '../../providers/classes/clubs';
import { ClubInLeague } from '../../providers/classes/clubinleague';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { Leagues } from '../../providers/classes/league';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { PlayerRecordInLeague } from '../../providers/classes/player_record_inleague';
import { Match } from '../../providers/classes/matches';
import { ListPlayerModels } from '../manager-league/bd69-club-inleague-profile/bd69-clubinleague-detail';

/**
 * Generated class for the ListPlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-player',
  templateUrl: 'list-player.html',
})
export class ListPlayerPage {
  @ViewChild(Content) mContent: Content;

  listPlayer: Array<Player> = [];

  mClub: ClubInLeague = new ClubInLeague();

  mListFormPlayer: Array<PlayerRecordInLeague> = [];

  stepLoadPlayer: number = 2;

  mListPlayerModels: Array<ListPlayerModels> = [];

  mListTabs: Array<{ id: number, name: string }> = [
    { id: 0, name: "Thông tin" },
    { id: 1, name: "Cầu thủ" },
    { id: 2, name: "Trận đấu" }
  ];

  mTabIDSelected: number = 0;

  mListItems1: Array<{ name: string, value: string }> = [];
  mListItems2: Array<{ name: string, value: string }> = [];

  mListMatch: Array<Match> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
    this.onLoadMListItem();
  }
  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mClub.setClubID(params["clubID"]);
      this.mClub.setLeagueID(params["leagueID"]);
    }
  }
  
  onLoadData(){
    this.mAppModule.getUserManager().sendRequestGetClubInLeagueInfo(this.mClub.getClubID(), this.mClub.getLeagueID());
    this.mAppModule.getLeagueManager().sendRequestGetPlayerInLeague(this.mClub.getLeagueID(), this.mClub.getClubID(), -1);
    this.mAppModule.getLeagueManager().sendRequestGetListPlayerFormInLeague(this.mClub.getLeagueID(), this.mClub.getClubID(), -1);
    this.onGetMatchStat();
  }
  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ListPlayerPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
    })

  }

  onGetMatchStat() {
    this.mAppModule.getLeagueManager().sendRequestGetListMatchOfLeague(this.mClub.getLeagueID(), this.mClub.getClubID());
  }


  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_CLUB_IN_LEAGUE_INFO) {
      this.onResponeGetClubInLeagueInfo(params);
    } else if (cmd == Bd69SFSCmd.GET_USER_IN_LEAGUE) {
      this.onResponeGetPlayerInLeague(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_PLAYER_FORM_IN_LEAGUE) {
      this.onResponeGetListPlayerFormInLeague(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_MATCH_OF_LEAGUE) {
      this.onResponeGetListMatchOfLeague(params);
    }
  }

  onResponeGetListMatchOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListMatch = [];
          this.mListMatch = this.mAppModule.getMatchManager().onResponeSFSArray(params);
          this.mListMatch.forEach(element => {
            element.setLeagueName(this.mAppModule.getLeagueManager().getLeagueByID(element.getLeagueID()).getName());
            element.stadiumName = this.mAppModule.getLeagueManager().getStadiumByID(element.getStadiumID()).getName();
          });
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ListPlayerPage");
  }

  onResponeGetClubInLeagueInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mClub.onFromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.onLoadMListItem();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }



  onResponeGetPlayerInLeague(params) {
    this.stepLoadPlayer--;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        this.listPlayer = this.mAppModule.getPlayerManager().onParsePlayer(params,this.mClub.getClubID(),this.mClub.getLeagueID());
        if (this.listPlayer.length > 0) {
          this.listPlayer.forEach(player => {
            player.setLeagueID(this.mClub.getLeagueID());
          })
        }
        if (this.stepLoadPlayer == 0) this.onLoadPlayerModels();
        this.onLoadMListItem();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  onResponeGetListPlayerFormInLeague(params) {
    this.stepLoadPlayer--;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
          this.mListFormPlayer = [];
          this.mListFormPlayer = this.mAppModule.getLeagueManager().onParsePlayerRecordInLeagueList(sfsArray);
          if (this.stepLoadPlayer == 0) this.onLoadPlayerModels();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  

  onClickViewProfile(player: ListPlayerModels) {
    this.navCtrl.push("ProfilePage", { params: player.player.getPlayerID() });
  }

  onClickImage(player: ListPlayerModels) {
    this.navCtrl.push("PlayerInfoPage", { params: { playerID: player.player.getPlayerID(), clubID: player.player.getClubID(), leagueID: player.player.getLeagueID() } });
  }

  onLoadPlayerModels() {
    this.listPlayer.forEach(player => {
      let playerRecord = this.mListFormPlayer.find(playerForm => {
        return player.getPlayerID() == playerForm.getPlayerID();
      })

      if (playerRecord) {
        player.onParsePlayerRecordInLeague(playerRecord);
        this.mListPlayerModels.push({
          player: player,
          state: playerRecord.getState()
        });
      }

    });
  }

  onClickTab(mTab, $event) {
    this.mTabIDSelected = mTab.id;
    this.mContent.scrollToTop(200);

    this.doMoveAnimateBar();
  }

  doMoveAnimateBar() {
    let animated = document.getElementById("animatedID");
    if (animated) {
      animated.style.transform = "translateX(" + (this.mTabIDSelected * 100) + "%)";
    }
  }

  onLoadMListItem() {
    this.mListItems1 = [
      { name: "Số trận đấu", value: this.mClub.getPlayed() + "" },
      { name: "Số trận thắng", value: this.mClub.getWon() + "" },
      { name: "Số trận thua", value: this.mClub.getLost() + "" },
      { name: "Số trận hoà", value: this.mClub.getDrawn() + "" },
      { name: "Số bàn thắng", value: this.mClub.getGoalsFor() + "" },
      { name: "Số bàn thua", value: this.mClub.getGoalsAgainst() + "" },
      { name: "Số thẻ đỏ", value: this.mClub.getRedCardNumber() + "" },
      { name: "Số thẻ vàng", value: this.mClub.getYellowCardNumber() + "" }
    ];

    this.mListItems2 = [
      { name: "Đội trưởng", value: this.getLeaderName() },
      { name: "Ông bầu", value: this.mClub.getShowman() },
      { name: "Email", value: this.mClub.getEmail() },
      { name: "Điện thoại", value: this.mClub.getHotline() },
    ];

  }

  getLeaderName(): string {
    let player = this.listPlayer.find(player => {
      return player.getPlayerID() == this.mClub.getLeaderID();
    })
    if (player) {
      return player.getName();
    } else {
      return "";
    }
  }

  goToMatchInfo(match : Match){
    this.navCtrl.push("MatchInfoPage",{params: {leagueID: this.mClub.getLeagueID(), matchID: match.getMatchID()}});
  }
}
