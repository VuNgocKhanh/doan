import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { MatchEvent } from '../../../providers/classes/mathchevent';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Player } from '../../../providers/classes/player';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Match } from '../../../providers/classes/matches';
import { ConstantManager, MatchEventType } from '../../../providers/manager/constant-manager';
import { ClubInMatch } from '../../../providers/classes/clubinmatch';

/**
 * Generated class for the MatchEventAddnewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match-event-addnew',
  templateUrl: 'match-event-addnew.html',
})
export class MatchEventAddnewPage {

  timeOffset: number = 1;

  time: number = 0;

  mMatch: Match = new Match();

  mEventSelected: MatchEvent = new MatchEvent();

  mListHomePlayers: Array<Player> = [];

  mListAwayPlayers: Array<Player> = [];

  mClub: ClubInMatch = new ClubInMatch();

  mPlayer: Player = new Player();

  mPlayer2: Player = new Player();

  eventName: string = "";

  constructor(
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  getEventNameByType(type: number): string {
    return ConstantManager.getInstance().getListMatchEventType()[type].name;
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mEventSelected.setLeagueID(params["leagueID"]);
      this.mEventSelected.setMatchID(params["matchID"]);
      this.mEventSelected.setType(params["type"]);
    } else if (this.navParams.data["event"]) {
      this.mEventSelected.fromObject(this.navParams.get("event"));
      this.mClub.setClubID(this.mEventSelected.getClubID());
      this.mPlayer.setPlayerID(this.mEventSelected.getPlayerID1());
      this.mPlayer2.setPlayerID(this.mEventSelected.getPlayerID2());
      this.time = this.mEventSelected.getTime();
    }
    this.eventName = ConstantManager.getInstance().getListMatchEventType()[this.mEventSelected.getType()].name;
    this.mMatch.setLeagueID(this.mEventSelected.getLeagueID());
    this.mMatch.setMatchID(this.mEventSelected.getMatchID());
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_MATCH_INFO(this.mMatch.getLeagueID(), this.mMatch.getMatchID());
  }

  onLoadPlayers() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER(this.mMatch.getLeagueID(), this.mMatch.getHomeID(), -1);
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER(this.mMatch.getLeagueID(), this.mMatch.getAwayID(), -1);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("MatchEventAddnewPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
    })

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("MatchEventAddnewPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_MATCH_INFO) {
      this.onResponeMatchInfo(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER) {
      this.onResponeGetListPlayer(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_ADD_NEW_MATCH_EVENT) {
      this.onResponeAddNewMatchEvent(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_MATCH_EVENT) {
      this.onResponeUpdateMatchEvent(params);
    }
  }

  onResponeMatchInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mMatch.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
          let match = this.mAppModule.getMatchManager().getMatchById(this.mMatch.getMatchID());
          if (match != null) {
            match.fromSFSobject(content.getSFSObject(ParamsKey.INFO));

          }
          let home = content.getSFSObject(ParamsKey.HOME);
          let away = content.getSFSObject(ParamsKey.AWAY);
          this.mMatch.getHomeClub().fromSFSObject(home);
          this.mMatch.getAwayClub().fromSFSObject(away);
          if (this.mClub.getClubID() > -1) this.onLoadClub();
          this.onLoadPlayers();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetListPlayer(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params, clubID, leagueID);
          if (clubID == this.mMatch.getHomeID()) {
            this.mListHomePlayers = arrayPlayers;
          } else {
            this.mListAwayPlayers = arrayPlayers;
          }
          /**Load Player info */
          if (this.mPlayer.getPlayerID() > -1) {
            let index = arrayPlayers.findIndex(player => {
              return player.getPlayerID() == this.mPlayer.getPlayerID();
            })
            if (index > -1) {
              this.mPlayer.fromPlayer(arrayPlayers[index]);
            }
          }

          if (this.mPlayer2.getPlayerID() > -1) {
            let index = arrayPlayers.findIndex(player => {
              return player.getPlayerID() == this.mPlayer2.getPlayerID();
            })
            if (index > -1) {
              this.mPlayer2.fromPlayer(arrayPlayers[index]);
            }
          }


        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddNewMatchEvent(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mEventSelected.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
        this.navCtrl.pop();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateMatchEvent(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mEventSelected.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
        this.mAppModule.showToast("Cập nhật sự kiện thành công!");
        this.navCtrl.pop();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickPlayer(type?: number) {
    let arrayPlayers = [];
    if (this.mClub.getClubID() > -1) {
      if (this.mClub.getClubID() == this.mMatch.getHomeID()) {
        arrayPlayers = this.mListHomePlayers;
      } else {
        arrayPlayers = this.mListAwayPlayers;
      }
    } else {
      arrayPlayers = this.mListHomePlayers.concat(this.mListAwayPlayers);
    }

    this.mAppModule.showModal("MatchEventAddnewSelectPlayerPage", { params: arrayPlayers }, (player: Player) => {
      if (player) {
        if (type) {
          if (type == 1) {
            this.mPlayer.fromPlayer(player);
            if (this.mPlayer.getClubID() != this.mPlayer2.getClubID()) {
              this.mPlayer2 = new Player();
            }
          } else {
            this.mPlayer2.fromPlayer(player);
            if (this.mPlayer.getClubID() != this.mPlayer2.getClubID()) {
              this.mPlayer = new Player();
            }
          }
        } else {
          this.mPlayer.fromPlayer(player);
        }

        this.mClub.setClubID(player.getClubID());
        this.onLoadClub();
      }
    });
  }

  onClickClub() {
    let options = [
      { id: this.mMatch.getHomeID(), name: this.mMatch.getHomeClub().getName() },
      { id: this.mMatch.getAwayID(), name: this.mMatch.getAwayClub().getName() }
    ];

    this.mAppModule.showRadio("Chọn câu lạc bộ", options, this.mClub.getClubID(), (clubID) => {
      if (clubID) {
        this.mClub.setClubID(clubID);
        this.onLoadClub();
        this.mPlayer = new Player();
        this.mPlayer2 = new Player();
      }
    });
  }

  onLoadClub() {
    if (this.mClub.getClubID() == this.mMatch.getHomeID()) {
      this.mClub.fromObject(this.mMatch.getHomeClub());
    } else {
      this.mClub.fromObject(this.mMatch.getAwayClub());
    }
  }

  onClickCheckMark() {
    this.mEventSelected.setPlayerID1(this.mPlayer.getPlayerID());
    this.mEventSelected.setPlayerID2(this.mPlayer2.getPlayerID());
    this.mEventSelected.setClubID(this.mClub.getClubID());
    this.mEventSelected.setTime(parseInt("" + this.time));
    this.mEventSelected.setDescription(this.mEventSelected.getName());

    if (this.mEventSelected.getTime() > 120) {
      this.mAppModule.showToast("Thời gian không thể vượt quá 120 phút");
    }
    if (this.mEventSelected.getType() == MatchEventType.CHANGE) {
      if (this.mEventSelected.getPlayerID2() == -1) {
        this.mAppModule.showToast("Bạn chưa chọn cầu thủ vào sân");
      } else if (this.mEventSelected.getPlayerID1() == -1) {
        this.mAppModule.showToast("Bạn chưa chọn cầu thủ ra sân");
      } else {
        this.mEventSelected.setName(this.mPlayer2.getName() + " vào sân " + this.mPlayer.getName() + " ra sân");
        this.onAddEvent(this.mEventSelected);
      }
    } else if (this.mEventSelected.getType() == MatchEventType.FIRST_HALF_OFFSET_TIME || this.mEventSelected.getType() == MatchEventType.SECOND_HALF_OFFSET_TIME) {
      if (this.timeOffset < 1) {
        this.mAppModule.showToast("Thời gian bù giờ phải lớn hơn hoặc bằng 1");
      } else {
        if (this.mEventSelected.getType() == MatchEventType.FIRST_HALF_OFFSET_TIME) {
          this.mEventSelected.setTime(44);
        } else if (this.mEventSelected.getType() == MatchEventType.SECOND_HALF_OFFSET_TIME) {
          this.mEventSelected.setTime(90);
        }
        this.mEventSelected.setName("+" + this.timeOffset);
        this.onAddEvent(this.mEventSelected);
      }
    }
    else {
      if (this.mEventSelected.getPlayerID1() == -1) {
        this.mAppModule.showToast("Bạn chưa chọn cầu thủ");
      } else if (this.mEventSelected.getClubID() == -1) {
        this.mAppModule.showToast("Bạn chưa chọn lạc bộ");
      } else {
        if (this.mEventSelected.getType() == MatchEventType.CHANGE) {
          this.mEventSelected.setName(this.mPlayer2.getName() + " vào sân " + this.mPlayer.getName() + " ra sân");
        } else {
          this.mEventSelected.setName(this.mPlayer.getName());
        }
        this.onAddEvent(this.mEventSelected);
      }
    }
  }

  onAddEvent(event: MatchEvent) {
    if (event.getEventID() > -1) {
      this.mAppModule.showLoading().then(() => {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_MATCH_EVENT(event);
      });
    } else {
      this.mAppModule.showLoading().then(() => {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_NEW_MATCH_EVENT(event);
      });
    }
  }
}
