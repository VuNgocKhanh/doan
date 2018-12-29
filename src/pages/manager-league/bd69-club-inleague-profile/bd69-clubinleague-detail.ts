import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RoleInClub, ConstantManager, StateClubInLeague, RoleInLeague, PlayerRecordState } from '../../../providers/manager/constant-manager';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Clubs } from '../../../providers/classes/clubs';
import { Leader } from '../../../components/info-club-request/info-club-request';
import { Leagues } from '../../../providers/classes/league';
import { Player } from '../../../providers/classes/player';
import { PlayerPositions } from '../../../providers/classes/play-position';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { PlayerRecordInLeague } from '../../../providers/classes/player_record_inleague';

/**
 * Generated class for the Bd69ClubinleagueDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ListPlayerModels {
  player: Player;
  state: number;
}

@IonicPage()
@Component({
  selector: 'page-bd69-clubinleague-detail',
  templateUrl: 'bd69-clubinleague-detail.html',
})
export class Bd69ClubinleagueDetailPage {
  icon_right: string = "";

  mRoleOfUserInClub: number = RoleInClub.CAPTAIN;

  disable: boolean = true;

  mListLeaders: Array<Player> = [];

  mClubSelected: ClubInLeague = new ClubInLeague();

  mLeaderSelected: Player = new Player();

  mListPlayer: Array<Player> = [];

  mListFormPlayer: Array<PlayerRecordInLeague> = [];

  type: number = 0;

  mListPlayerModels: Array<ListPlayerModels> = [];

  stepLoadPlayer: number = 2;

  isLoadInfo: boolean = true;

  numberDidEnter: number = 0;

  numberPlayerValidated: number = 0;

  numberPlayerInValid: number = 0;


  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_CLUB_INFO(this.mClubSelected.getLeagueID(), this.mClubSelected.getClubID());
    this.mAppModule.getLeagueManager().sendRequestLEAGUE_GET_LIST_PLAYER(this.mClubSelected.getLeagueID(), this.mClubSelected.getClubID(), -1);
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER_FORM(this.mClubSelected.getLeagueID(), this.mClubSelected.getClubID());
  }

  onLoadNumber() {
    this.numberPlayerInValid = 0;
    this.numberPlayerValidated = 0;
    this.mListPlayerModels.forEach(player => {
      if (player.state == PlayerRecordState.VALIDATED) {
        this.numberPlayerValidated++;
      } else {
        this.numberPlayerInValid++;
      }
    })
  }

  ionViewDidEnter() {
    if (this.numberDidEnter > 0) {
      this.onLoadData();
    }
    this.numberDidEnter++;
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mClubSelected.setClubID(params["clubID"]);
      this.mClubSelected.setLeagueID(params["leagueID"]);
      let type = params["type"];
    }
  }


  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }

    Bd69SFSConnector.getInstance().addListener("Bd69SignLeaguePage", respone => {
      this.onExtensionResponse(respone);
    })
    this.onLoadData();
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("Bd69ClubinleagueDetailPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_CLUB_INFO) {
      this.onResponeGetClubInLeagueInfo(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onResponeGetPlayerInLeague(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER_FORM) {
      this.onResponeGetPlayerFormInLeague(params);
    } else if (cmd == Bd69SFSCmd.CHANGE_PLAYER_FORM_STATE) {
      this.onResponeChangePlayerFormState(params);
    } else if (cmd == Bd69SFSCmd.REMOVE_PLAYER_FROM_LEAGUE) {
      this.onResponeRemovePlayerFromLeague(params);
    } else if (cmd == Bd69SFSCmd.CHANGE_CLUB_STATE_IN_LEAGUE) {
      this.onResponeChangeStateClubInLeague(params);
    }

  }



  onResponeGetClubInLeagueInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mClubSelected.onFromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
    this.isLoadInfo = false;
  }

  onResponeGetPlayerInLeague(params) {
    this.stepLoadPlayer--;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.onParsePlayerInLeague(params);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParsePlayerInLeague(params) {
    let content = params.getSFSObject(ParamsKey.CONTENT);
    if (content) {
      if (content.containsKey(ParamsKey.ARRAY)) {
        this.mListPlayer = [];
        this.mListPlayer = this.mAppModule.getPlayerManager().onParsePlayer(params, this.mClubSelected.getClubID(), this.mClubSelected.getLeagueID());
        if (this.stepLoadPlayer == 0) this.onLoadPlayerModels();
      }
    }
  }

  onResponeGetPlayerFormInLeague(params) {
    this.stepLoadPlayer--;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.onParseListPlayerFormInLeague(params);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListPlayerFormInLeague(params) {
    let content = params.getSFSObject(ParamsKey.CONTENT);
    if (content) {
      if (content.containsKey(ParamsKey.ARRAY)) {
        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        this.mListFormPlayer = [];
        this.mListFormPlayer = this.mAppModule.getLeagueManager().onParsePlayerRecordInLeagueList(sfsArray);
        if (this.stepLoadPlayer == 0) this.onLoadPlayerModels();
      }
    }
  }

  onResponeChangePlayerFormState(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.onChangeStatePlayerFormSucess(params);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onChangeStatePlayerFormSucess(params) {
    this.mAppModule.showToast("Cập nhật trạng thái hồ sơ thành công");
    let content = params.getSFSObject(ParamsKey.CONTENT);
    if (content) {
      let playerID = content.getInt(ParamsKey.PLAYER_ID);
      let index = this.mListPlayerModels.findIndex(player => {
        return player.player.getPlayerID() == playerID;
      })
      if (index > -1) {
        if (content.containsKey(ParamsKey.INFO)) {
          let info = content.getSFSObject(ParamsKey.INFO);
          if (info.containsKey(ParamsKey.STATE)) {
            console.log(info.getInt(ParamsKey.STATE));
            
            this.mListPlayerModels[index].state = info.getInt(ParamsKey.STATE);
          }
        }
      }

    }
  }



  onResponeRemovePlayerFromLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let playerID = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayer.findIndex(player => {
          return player.getPlayerID() == playerID;
        })

        if (index > -1) {
          this.mAppModule.showToast("Đã xoá cầu thủ " + this.mListPlayer[index].getName() + " khỏi giải đấu");

          this.mListPlayer.splice(index, 1);
          this.onLoadPlayerModels();
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }
  onResponeChangeStateClubInLeague(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let state = params.getInt(ParamsKey.STATE);
      this.mClubSelected.setState(state);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadPlayerModels() {
    this.mListPlayerModels = [];
    this.mListPlayer.forEach(player => {
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

    this.onLoadNumber();
  }



  onClickManager() {

  }


  onClickAddPlayer() {
    this.mAppModule.showModalIonic("AddRemovePlayerInleaguePage", { params: { leagueID: this.mClubSelected.getLeagueID(), clubID: this.mClubSelected.getClubID(), listAdded: this.mListPlayer } });
  }

  onClickSubmitProfile() {
    if (!this.disable) return;

    this.mAppModule.showActionSheet(this.mClubSelected.getName(), ConstantManager.getInstance().getActionSheetStateProfile(), (state) => {
      if (state) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestChangeStateClubInLeague(this.mClubSelected.getClubID(), this.mClubSelected.getLeagueID(), state);

        })
      }
    })
  }

  goToProfileUser(playerID: number, leagueID: number) {
    this.navCtrl.push("ProfileUserPage", { players: { leagueID: leagueID, playerID: playerID }, role: 2 });
  }

  getNameOfState(state): string {
    return ConstantManager.getInstance().getNameOfPlayerRecordState(state);
  }

  onClickPlayer(player: ListPlayerModels) {
    let arrayOptions = [];
    if (this.disable) {
      arrayOptions.push({ id: 1, name: "Xem hồ sơ" });
      if (player.state != PlayerRecordState.VALIDATED) {
        arrayOptions.push({ id: 2, name: "Đánh dấu hồ sơ hợp lệ" });
      } 
      else if (player.state == PlayerRecordState.VALIDATED) {
        arrayOptions.push({ id: 3, name: "Đánh dấu hồ sơ không hợp lệ" });
      }
      arrayOptions.push({ id: 4, name: "Xóa khỏi giải đấu" });

      this.mAppModule.showActionSheet(player.player.getName(), arrayOptions, (id) => {
        this.doActionSheet(id, player);
      })
    } else {
      arrayOptions = [
        { id: 1, name: "Xem hồ sơ" },
        { id: 4, name: "Xoá khỏi giải đấu" }
      ];
      this.mAppModule.showActionSheet(player.player.getName(), arrayOptions, (id) => {
        console.log(id);
        
        this.doActionSheet(id, player);
      })
    }
  }

  doActionSheet(id, player: ListPlayerModels) {
    if (id == 1) {
      this.goToProfileUser(player.player.getPlayerID(), player.player.getLeagueID());
    } else if (id == 2) {
      this.mAppModule.getLeagueManager().sendRequestChangePlayerFormState(player.player.getPlayerID(), player.player.getLeagueID(), PlayerRecordState.VALIDATED);
    } else if (id == 3) {
      this.mAppModule.getLeagueManager().sendRequestChangePlayerFormState(player.player.getPlayerID(), player.player.getLeagueID(), PlayerRecordState.INVALID);
    } else if (id == 4) {
      this.mAppModule.getLeagueManager().removePlayerFromLeague(player.player.getLeagueID(), player.player.getClubID(), player.player.getPlayerID());
    }
  }


  onClickAddManager() {
    this.navCtrl.push("Bd69ClubInleagueUpdatemanagerPage", { params: { leagueID: this.mClubSelected.getLeagueID(), clubID: this.mClubSelected.getClubID() } });
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }

}
