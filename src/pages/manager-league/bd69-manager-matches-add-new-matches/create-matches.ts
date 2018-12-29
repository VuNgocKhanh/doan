import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { Stadium } from '../../../providers/classes/stadium';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { Match } from '../../../providers/classes/matches';
import { CalendarDate } from '../../../providers/core/calendar/calendar-date';
import { Utils } from '../../../providers/core/app/utils';
import { Rounds } from '../../../providers/classes/rounds';
import { RefereeInMatch } from '../../../providers/classes/referee';
import { RefereeManager } from '../../../providers/manager/referee-manager';
import { Group } from '../../../providers/classes/group';
import { StateClubInLeague } from '../../../providers/manager/constant-manager';

/**
 * Generated class for the CreateMatchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-matches',
  templateUrl: 'create-matches.html',
})
export class CreateMatchesPage {

  club1: ClubInLeague = new ClubInLeague();

  club2: ClubInLeague = new ClubInLeague();

  mClubInLeagues: Array<ClubInLeague> = [];

  mStadiums: Array<Stadium> = [];

  mRounds: Array<Rounds> = [];

  mGroups: Array<Group> = [];

  // ===========++++++++++=================

  mStadiumSelected: Stadium = new Stadium();

  mRoundSelected: Rounds = new Rounds();

  mGroupSelected: Group = new Group();

  mListRefereeInMatch: Array<RefereeInMatch> = [];

  arrays: Array<{ name: string, values: Array<{ id: number, name: string }>, selected: number }> = [];

  leagueID: number = -1;

  newMatch: Match = new Match();

  mDateSelected: CalendarDate = new CalendarDate();

  mTime: { hour: number, minutes: number } = { hour: 0, minutes: 0 };

  dateString: string = "";

  timeString: string = "";

  isModeNew: boolean = true;

  constructor(
    public mAlertController: AlertController,
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }



  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.leagueID = this.navParams.get("params");
      this.newMatch.setLeagueID(this.leagueID);
      this.isModeNew = true;
    } else if (this.navParams.data["match"]) {
      this.newMatch = this.navParams.get("match");
      this.leagueID = this.newMatch.getLeagueID();
      this.mStadiumSelected.setStadiumID(this.newMatch.getStadiumID());
      this.mRoundSelected.setRoundiD(this.newMatch.getRoundID());
      this.mGroupSelected.setGroupID(this.newMatch.getGroupID());
      this.club1.setClubID(this.newMatch.getHomeID());
      this.club2.setClubID(this.newMatch.getAwayID());
      this.mDateSelected.setTime(this.newMatch.getTimeStartDate());
      this.dateString = this.mDateSelected.getDateString();
      this.mTime = {
        hour: this.newMatch.getTimeStartDate().getHours(),
        minutes: this.newMatch.getTimeStartDate().getMinutes()
      };

      this.timeString = this.getTimeString();
      this.isModeNew = false;
    }
  }

  onLoadData() {
    // this.mAppModule.getLeagueManager().getClubInLeague(this.leagueID);
    // this.mAppModule.getLeagueManager().sendRequestGetListStadiumInLeague(this.leagueID);
    // this.mAppModule.getLeagueManager().sendRequestGET_LIST_ROUND_OF_LEAGUE(this.leagueID);
    this.mAppModule.getLeagueManager().sendRequestGetListGroupOfLeague(this.leagueID);

    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_CLUB(this.leagueID);
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_STATIDUM(this.leagueID);
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_ROUND(this.leagueID);
    // Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_GROUP(this.leagueID);

    if (!this.isModeNew) {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_MATCH_REFEREE(this.leagueID, this.newMatch.getMatchID());
    }

  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("CreateMatchesPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
    })

  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("CreateMatchesPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_CLUB) {
      this.onResponeGetClubInLeague(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_STATIDUM) {
      this.onResponeStadiumSucess(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_ROUND) {
      this.onResponeListRoundSuccess(params);
      // } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_GROUP) {
      //   this.onResponeGroupInLeague(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_REFEREE_FROM_MATCH) {
      this.onResponeRemoveRefereeFromMatch(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_REFEREE_IN_MATCH) {
      this.onResponeUpdateRefereeInMatch(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_REFEREE_INTO_MATCH) {
      this.onResponeAddRefereeIntoMatch(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_MATCH_REFEREE) {
      this.onResponeRefereeInMatch(params);
    }

    // if (cmd == Bd69SFSCmd.GET_CLUB_IN_LEAGUE) {
    //   this.onResponeGetClubInLeague(params);
    // } else if (cmd == Bd69SFSCmd.GET_LIST_STADIUM_IN_LEAGUE) {
    //   this.onResponeStadiumSucess(params);
    // } else if (cmd == Bd69SFSCmd.GET_LIST_ROUND_OF_LEAGUE) {
    //   this.onResponeListRoundSuccess(params);
    // } 
    else if (cmd == Bd69SFSCmd.GET_LIST_GROUP_OF_LEAGUE) {
      this.onResponeGroupInLeague(params);
    }


    else if (cmd == Bd69SFSCmd.LEAGUE_ADD_NEW_MATCH) {
      this.mAppModule.hideLoading();
      this.onCreateMatchSuccess(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_MATCH_INFO) {
      this.mAppModule.hideLoading();
      this.onUpdateMatchSuccess(params);
    }

    // else if (cmd == Bd69SFSCmd.ADD_NEW_MATCH) {
    //   this.mAppModule.hideLoading();
    //   this.onCreateMatchSuccess(params);
    // } else if (cmd == Bd69SFSCmd.UPDATE_MATCH_INFO) {
    //   this.mAppModule.hideLoading();
    //   this.onUpdateMatchSuccess(params);
    // }

  }

  onResponeGroupInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mGroups = this.mAppModule.getLeagueManager().onParseGroupList(content.getSFSArray(ParamsKey.ARRAY));

          if (this.mGroups.length > 0 && this.mGroupSelected.getGroupID() > -1) {
            let index = this.mGroups.findIndex(group => {
              return group.getGroupID() == this.mGroupSelected.getGroupID();
            })
            if (index > -1) {
              this.mGroupSelected = this.mGroups[index];
            }
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetClubInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mClubInLeagues = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.club1.getClubID() > -1 && this.club2.getClubID() > -1) {
            this.mClubInLeagues.forEach(element => {
              if (element.getClubID() == this.club1.getClubID()) {
                this.club1 = element;
              } else if (element.getClubID() == this.club2.getClubID()) {
                this.club2 = element;
              }
            });
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeStadiumSucess(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mStadiums = this.mAppModule.getLeagueManager().onParseStadiumList(content.getSFSArray(ParamsKey.ARRAY));

          if (this.mStadiums.length > 0) {
            if (this.mStadiumSelected.getStadiumID() > -1) {
              let index = this.mStadiums.findIndex(stadium => {
                return stadium.getStadiumID() == this.mStadiumSelected.getStadiumID();
              })
              if (index > -1) {
                this.mStadiumSelected = this.mStadiums[index];
              }
            } else {
              this.mStadiumSelected = this.mStadiums[0];
            }
          }
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  onResponeListRoundSuccess(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mRounds = this.mAppModule.getLeagueManager().onParseRoundList(content.getSFSArray(ParamsKey.ARRAY));
          if (this.mRounds.length > 0 && this.mRoundSelected.getRoundiD() > -1) {
            let index = this.mRounds.findIndex(round => {
              return round.getRoundiD() == this.mRoundSelected.getRoundiD();
            })
            if (index > -1) {
              this.mRoundSelected = this.mRounds[index];
            }
          }
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRefereeInMatch(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.REFEREES)) {
          this.mListRefereeInMatch = RefereeManager.getInstance().onParseSFSRefereeInMatchArray(content.getSFSArray(ParamsKey.REFEREES), this.leagueID);
        }
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onCreateMatchSuccess(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {


      let content = params.getSFSObject(ParamsKey.CONTENT);
      let away = content.getSFSObject(ParamsKey.AWAY);
      let home = content.getSFSObject(ParamsKey.HOME);
      let info = content.getSFSObject(ParamsKey.INFO);
      this.newMatch.fromSFSobject(info);
      this.newMatch.getHomeClub().fromSFSObject(home);
      this.newMatch.getAwayClub().fromSFSObject(away);

      this.onAddRefereeIntoMatch();
      if (this.numberReferee > 0) {
      } else {
        this.mAppModule.showToast("Tạo trận đấu thành công");
        this.mViewController.dismiss(this.newMatch);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onUpdateMatchSuccess(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Chỉnh sửa trận đấu thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      let away = content.getSFSObject(ParamsKey.AWAY);
      let home = content.getSFSObject(ParamsKey.HOME);
      let info = content.getSFSObject(ParamsKey.INFO);
      this.newMatch.fromSFSobject(info);
      this.newMatch.getHomeClub().fromSFSObject(home);
      this.newMatch.getAwayClub().fromSFSObject(away);
      this.mViewController.dismiss(this.newMatch);
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRemoveRefereeFromMatch(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let refereeID = content.getInt(ParamsKey.REFEREE_ID);

        let index = this.mListRefereeInMatch.findIndex(referee => {
          return referee.getRefereeID() == refereeID;
        });

        if (index > -1) {
          this.mAppModule.showToast("Đã xoá trọng tài " + this.mListRefereeInMatch[index].getName() + " khỏi trận đấu");
          this.mListRefereeInMatch.splice(index, 1);
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateRefereeInMatch(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let refereeID = content.getInt(ParamsKey.REFEREE_ID);
        let info = content.getSFSObject(ParamsKey.INFO);

        let index = this.mListRefereeInMatch.findIndex(referee => {
          return referee.getRefereeID() == refereeID;
        });

        if (index > -1) {
          this.mListRefereeInMatch[index].fromSFSObject(info);
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddRefereeIntoMatch(params) {
    this.numberReferee--;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (this.numberReferee == 0) {
          this.mAppModule.showToast("Tạo trận đấu thành công");
          this.navCtrl.pop();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }


  getTime($event) {
    this.mTime = $event;
  }


  getChange(value, m) {
    m.selected = value;
  }

  getGroupNameByGroupID(groupID: number): string {
    if (this.mGroups.length == 0) return "";
    for (let group of this.mGroups) {
      if (group.getGroupID() == groupID) {
        return group.getName();
      }
    }
    return "";
  }

  _onSelectHomeClub() {
    let arrayClubs = this.mClubInLeagues.filter(club => {
      return club.getClubID() != this.club2.getClubID() && club.state < StateClubInLeague.BLOCKED;
    });
    let array = [];

    arrayClubs.forEach(ele => {
      if (this.mGroupSelected.getGroupID() > -1) {
        if (ele.getGroupID() == this.mGroupSelected.getGroupID()) {
          array.push({ id: ele.getClubID(), name: ele.getName() });
        }
      } else {
        array.push({ id: ele.getClubID(), name: ele.getName() });
      }

    });

    if (array.length < 2) {
      if (this.mGroupSelected.getGroupID() > -1) {
        this.mAppModule.showToast("Bảng " + this.mGroupSelected.getName() + " không đủ câu lạc bộ để tạo trận đấu");
      } else {
        this.mAppModule.showToast("Số câu lạc bộ không đủ để tạo trận đấu");
      }
      return;
    }

    this.mAppModule.showRadio("Chọn câu lạc bộ", array, this.club1.getClubID(), (res) => {
      if (res) {
        let index = this.mClubInLeagues.findIndex(club => {
          return club.getClubID() == res;
        })
        if (index > -1) {
          this.club1 = this.mClubInLeagues[index];
        } else {
          this.club1.setName("Chọn câu lạc bộ");
        }
      }
    });
  }

  _onSelectAwayClub() {
    let arrayClubs = this.mClubInLeagues.filter(club => {
      return club.getClubID() != this.club1.getClubID() && club.state < StateClubInLeague.BLOCKED;
    });

    let array = [];
    arrayClubs.forEach(ele => {
      if (this.mGroupSelected.getGroupID() > -1) {
        if (ele.getGroupID() == this.mGroupSelected.getGroupID()) {
          array.push({ id: ele.getClubID(), name: ele.getName() });
        }
      } else {
        array.push({ id: ele.getClubID(), name: ele.getName() });
      }

    });

    if (array.length < 2) {
      if (this.mGroupSelected.getGroupID() > -1) {
        this.mAppModule.showToast("Bảng " + this.mGroupSelected.getName() + " không đủ câu lạc bộ để tạo trận đấu");
      } else {
        this.mAppModule.showToast("Số câu lạc bộ không đủ để tạo trận đấu");
      }
      return;
    }

    this.mAppModule.showRadio("Chọn câu lạc bộ", array, this.club2.getClubID(), (clubID) => {
      if (clubID) {

        let index = this.mClubInLeagues.findIndex(club => {
          return club.getClubID() == clubID;
        })
        if (index > -1) {
          this.club2 = this.mClubInLeagues[index];
        } else {
          this.club2.setName("Chọn câu lạc bộ");
        }
      }
    })
  }

  showRadio(number) {
    if (number == 1) {
      this._onSelectHomeClub();
    } else {
      this._onSelectAwayClub();
    }
  }

  onClickCreate() {
    if (this.club1.getClubID() == -1 || this.club2.getClubID() == -1 || this.newMatch.getTimeStart() == -1 || !this.mTime || this.mDateSelected.dd == -1 || this.newMatch.getDuration() <= 0) {
      this.mAppModule.showToast("Bạn chưa điền đầy đủ thông tin");
    } else {
      let time = new Date(this.mDateSelected.yy + "-" + Utils.getStringNumber(this.mDateSelected.mm + 1) + "-" + Utils.getStringNumber(this.mDateSelected.dd));
      time.setHours(this.mTime.hour);
      time.setMinutes(this.mTime.minutes);
      this.newMatch.setTimeStart(time.getTime());
      this.newMatch.setStadiumID(this.mStadiumSelected.getStadiumID());
      this.newMatch.setHomeID(this.club1.getClubID());
      this.newMatch.setAwayID(this.club2.getClubID());
      this.newMatch.setRoundID(this.mRoundSelected.getRoundiD());
      this.mAppModule.showLoading().then(() => {
        if (this.isModeNew) {
          // this.mAppModule.getLeagueManager().sendRequestAddNewMatch(this.newMatch);
          Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_NEW_MATCH(this.newMatch);
        } else {
          // this.mAppModule.getMatchManager().sendRequestUpdateMatchInfo(this.newMatch.getLeagueID(), this.newMatch);
          Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_MATCH_INFO(this.newMatch.getLeagueID(), this.newMatch);
        }
      })
    }
  }

  onClickDate() {
    this.mAppModule.showModal("SelectDatePage", { params: this.mDateSelected }, (res) => {
      if (res) {
        this.mDateSelected = res;
        this.dateString = this.mDateSelected.getDateString();
      }
    })
  }

  onClickRound() {
    let arr = [];
    this.mRounds.forEach(round => {
      arr.push({ id: round.getRoundiD(), name: round.getName() });
    })
    this.mAppModule.showRadio("Chọn vòng đấu", arr, this.mRoundSelected.getRoundiD(), (roundID) => {
      if (roundID) {
        this.mRoundSelected = this.mRounds.find(round => {
          return round.getRoundiD() == roundID;
        })
      }
    });
  }

  onClickGroup() {
    let arr = [];
    this.mGroups.forEach(group => {
      arr.push({ id: group.getGroupID(), name: group.getName() });
    })
    this.mAppModule.showRadio("Chọn bảng đấu", arr, this.mGroupSelected.getGroupID(), (groupID) => {
      if (groupID) {
        this.mGroupSelected = this.mGroups.find(group => {
          return group.getGroupID() == groupID;
        })
      }
    });
  }

  onClickDuration() {
    this.mAppModule.showPromt("Thời gian trận đấu", (time) => {
      if (time) {
        this.newMatch.setDuration(time);
      }
    }, this.newMatch.getDuration() + "", "", "number");
  }

  onClickStadium() {
    let arr = [];
    this.mStadiums.forEach(sta => {
      arr.push({ id: sta.getStadiumID(), name: sta.getName() });
    })
    this.mAppModule.showRadio("Chọn sân vận động", arr, this.mStadiumSelected.getStadiumID(), (stadiumID) => {
      if (stadiumID) {
        this.mStadiumSelected = this.mStadiums.find(stadium => {
          return stadium.getStadiumID() == stadiumID;
        })
      }
    });
  }

  onClickCheckmark() {
    this.onClickCreate();
  }

  selectTime() {
    this.mAppModule.showModal("SelectTimePage", { params: [this.mTime.hour, this.mTime.minutes] }, (res) => {
      if (res) {
        this.mTime = {
          hour: res[0],
          minutes: res[1]
        };
        this.timeString = this.getTimeString();
      }
    })
  }

  getTimeString(): string {
    return (this.mTime.hour < 10 ? "0" : "") + this.mTime.hour + ":" + (this.mTime.minutes < 10 ? "0" : "") + this.mTime.minutes;
  }


  onClickAddReferee() {
    this.mAppModule.showModalIonic("Bd69AddRefereeIntoMatchPage", { params: { leagueID: this.leagueID, matchID: this.newMatch.getMatchID(), listReferee: this.mListRefereeInMatch } }, (listReferee: Array<RefereeInMatch>) => {
      if (listReferee) {
        this.mListRefereeInMatch = listReferee;
      }
    });
  }

  numberReferee: number = 0;
  onAddRefereeIntoMatch() {
    if (this.mListRefereeInMatch.length == 0) return;
    this.numberReferee = this.mListRefereeInMatch.length;
    this.mListRefereeInMatch.forEach(referee => {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_REFEREE_INTO_MATCH(referee.getRefereeID(), this.newMatch.getLeagueID(), this.newMatch.getMatchID(), referee.getRefereeRole());
    })
  }

  onClickReferee(item: RefereeInMatch) {
    let options = [
      { id: 1, name: "Xem thông tin " },
      { id: 2, name: "Chọn làm trọng tài chính" },
      { id: 3, name: "Chọn làm trọng tài biên" },
      { id: 4, name: "Chọn làm giám sát " },
      { id: 5, name: "Xóa khỏi trận đấu" }
    ];

    this.mAppModule.showActionSheetNoDestruc(item.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToViewProfile(item);
        } else if (id > 1 && id < 5) {
          if (this.newMatch.getMatchID() > -1) {
            this.doUpdateRefereeRole(item, id);
          } else {
            this.doUpdateRefereeInMatch(item, id);
          }
        } else {
          if (this.newMatch.getMatchID() > -1) {
            this.doRemoveRefereeFromMatch(item.getRefereeID());
          } else {
            let index = this.mListRefereeInMatch.findIndex(referee => {
              return referee.getRefereeID() == item.getRefereeID();
            })

            if (index > -1) {
              this.mListRefereeInMatch.splice(index, 1);
            }
          }
        }
      }
    });
  }

  goToViewProfile(item) {

  }

  doRemoveRefereeFromMatch(refereeID: number) {
    this.mAppModule.showLoading().then(() => {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_REFEREE_FROM_MATCH(refereeID, this.newMatch.getLeagueID(), this.newMatch.getMatchID());
    });
  }

  doUpdateRefereeRole(referee: RefereeInMatch, role: number) {
    let newRole = role - 1;
    if (newRole == 1) {
      let indexMain = this.onCheckIndexOfMainReferee();
      if (indexMain > -1) {
        let refereeIndex = this.mListRefereeInMatch.findIndex(ref => {
          return ref.getRefereeID() == referee.getRefereeID();
        })
        if (refereeIndex == indexMain) {
          this.mAppModule.showToast("Người này đã là trọng tài chính");
        } else {
          this.showConfirmMessage(() => {
            this.mAppModule.showLoading().then(() => {
              Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(this.mListRefereeInMatch[indexMain].getRefereeID(), this.newMatch.getLeagueID(), this.newMatch.getMatchID(), referee.getRefereeRole());
              Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(referee.getRefereeID(), this.newMatch.getLeagueID(), this.newMatch.getMatchID(), role - 1);
            });
          });
        }
      } else {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(referee.getRefereeID(), this.newMatch.getLeagueID(), this.newMatch.getMatchID(), role - 1);
      }
    } else {
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(referee.getRefereeID(), this.newMatch.getLeagueID(), this.newMatch.getMatchID(), role - 1);
    }

  }

  doUpdateRefereeInMatch(referee: RefereeInMatch, role: number) {
    let newRole = role - 1;
    if (newRole == 1) {
      let indexMain = this.onCheckIndexOfMainReferee();
      if (indexMain > -1) {
        let refereeIndex = this.mListRefereeInMatch.findIndex(ref => {
          return ref.getRefereeID() == referee.getRefereeID();
        })
        if (refereeIndex == indexMain) {
          this.mAppModule.showToast("Người này đã là trọng tài chính");
        } else {
          this.showConfirmMessage(() => {
            this.mListRefereeInMatch[indexMain].setRefereeRole(referee.getRefereeRole());
            referee.setRefereeRole(role - 1);
          });
        }
      } else {
        referee.setRefereeRole(role - 1);
      }
    } else {
      referee.setRefereeRole(role - 1);
    }
  }

  onCheckIndexOfMainReferee(): number {
    if (this.mListRefereeInMatch.length == 0) return -1;
    return this.mListRefereeInMatch.findIndex(referee => {
      return referee.getRefereeRole() == 1;
    })
  }

  showConfirmMessage(callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setMessage("Trận đấu đã có trọng tài chính bạn có muốn thay đổi trọng tài chính hiện tại ?");
    alert.addButton(
      { text: "Không" }
    );
    alert.addButton({
      text: "Có",
      handler: () => {
        callback();
      }
    })
    alert.present();
  }

}
