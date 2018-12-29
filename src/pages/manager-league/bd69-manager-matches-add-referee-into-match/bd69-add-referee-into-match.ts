import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { RefereInLeague, RefereeInMatch } from '../../../providers/classes/referee';
import { RefereeManager } from '../../../providers/manager/referee-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the Bd69AddRefereeIntoMatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-add-referee-into-match',
  templateUrl: 'bd69-add-referee-into-match.html',
})
export class Bd69AddRefereeIntoMatchPage {

  mLeagueID: number = -1;

  mMatchID: number = -1;

  mReferees: Array<RefereInLeague> = [];

  mRefereesFillter: Array<RefereeInMatch> = [];

  mRefereesInMatch: Array<RefereeInMatch> = [];

  constructor(
    public mAlertController: AlertController,
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }


  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(this.mLeagueID, null, -1);
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mLeagueID = params["leagueID"];
      this.mMatchID = params["matchID"];
      this.mRefereesInMatch = params["listReferee"];
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("Bd69AddRefereeIntoMatchPage", respone => {
        this.onExtendsionRespone(respone);
      })
      this.onLoadData();
    })

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69AddRefereeIntoMatchPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_REFEREE) {
      this.onResponeRefereeInLeague(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_REFEREE_FROM_MATCH) {
      this.onResponeRemoveRefereeFromMatch(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_REFEREE_IN_MATCH) {
      this.onResponeUpdateRefereeInMatch(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_REFEREE_INTO_MATCH) {
      this.onResponeAddRefereeIntoMatch(params);
    }
  }

  onResponeAddRefereeIntoMatch(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let refereeID = content.getInt(ParamsKey.REFEREE_ID);

        let index1 = this.mRefereesFillter.findIndex(referee => {
          return referee.getRefereeID() == refereeID;
        });

        if (index1 > -1) {
          this.mRefereesFillter[index1].fromSFSObject(content.getSFSObject(ParamsKey.INFO));
        }

        if (content.containsKey(ParamsKey.INFO)) {
          let newReferee = new RefereeInMatch();
          newReferee.fromSFSObject(content.getSFSObject(ParamsKey.INFO));
          this.mRefereesInMatch.push(newReferee);
          this.mAppModule.showToast("Đã thêm trọng tài " + newReferee.getName() + " vào trận đấu");
        }
      }
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

        let index1 = this.mRefereesFillter.findIndex(referee => {
          return referee.getRefereeID() == refereeID;
        });
        let index2 = this.mRefereesInMatch.findIndex(referee => {
          return referee.getRefereeID() == refereeID;
        });

        if (index1 > -1) {
          this.mRefereesFillter[index1].setRefereeRole(-1);
        }

        if (index2 > -1) {
          this.mRefereesInMatch.splice(index2, 1);
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

        let index1 = this.mRefereesFillter.findIndex(referee => {
          return referee.getRefereeID() == refereeID;
        });
        let index2 = this.mRefereesInMatch.findIndex(referee => {
          return referee.getRefereeID() == refereeID;
        });

        if (index1 > -1) {
          this.mRefereesFillter[index1].fromSFSObject(info);
        }

        if (index2 > -1) {
          this.mRefereesInMatch[index2].fromSFSObject(info);
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRefereeInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mReferees = RefereeManager.getInstance().onParseSFSRefereeInLeagueArray(content.getSFSArray(ParamsKey.ARRAY));
          if (this.mReferees.length > 0) {
            this.mRefereesFillter = [];
            this.mReferees.forEach(referee => {
              let newReferee = new RefereeInMatch();
              newReferee.fromRefereeInLeague(referee);
              newReferee.setRefereeRole(this.onCheckRoleOfReferee(referee.getRefereeID()));
              this.mRefereesFillter.push(newReferee);
            });
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onCheckRoleOfReferee(id: number): number {
    if (this.mRefereesInMatch.length == 0) return -1;
    for (let referee of this.mRefereesInMatch) {
      if (referee.getRefereeID() == id) {
        return referee.getRefereeRole();
      }
    }
    return -1;
  }

  onClickItem(item: RefereeInMatch) {
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
          if (this.mMatchID > -1) {
            this.doUpdateRefereeRole(item, id);
          } else {
            this.doUpdateRefereeInMatch(item, id);
          }
        } else {
          if (this.mMatchID > -1) {
            this.doRemoveRefereeFromMatch(item.getRefereeID());
          } else {
            let index = this.mRefereesFillter.findIndex(referee => {
              return referee.getRefereeID() == item.getRefereeID();
            })

            if (index > -1) {
              this.mRefereesFillter.splice(index, 1);
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
      Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_REFEREE_FROM_MATCH(refereeID, this.mLeagueID, this.mMatchID);
    });
  }

  doUpdateRefereeRole(referee: RefereeInMatch, role: number) {
    let newRole = role - 1;
    this.mAppModule.doLogConsole("newRole", newRole);

    if (newRole == 1) {
      let indexMain = this.onCheckIndexOfMainRefereeFillter();
      if (indexMain > -1) {
        /**Đã có trọng tài chính */

        let refereeIndex = this.mRefereesFillter.findIndex(ref => {
          return ref.getRefereeID() == referee.getRefereeID();
        })
        if (refereeIndex > -1 && refereeIndex == indexMain) {
          this.mAppModule.showToast("Người này đã là trọng tài chính");
        } else {
          this.showConfirmMessage(() => {


            let index = this.mRefereesInMatch.findIndex(refere => {
              return refere.getRefereeID() == referee.getRefereeID();
            })

            if (index > -1) {
              /**Nếu trọng tài mới đã được thêm vào giải đấu Update cả 2 thằng*/
              this.mAppModule.showLoading().then(() => {
                Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(this.mRefereesFillter[indexMain].getRefereeID(), this.mLeagueID, this.mMatchID, referee.getRefereeRole());
                Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(referee.getRefereeID(), this.mLeagueID, this.mMatchID, role - 1);
              });
            } else {
              /**Nếu trọng tài mới chưa được thêm vào giải đấu xoá thằng main cũ đi và thêm thằng mới vào*/

              this.mAppModule.showLoading().then(() => {
                Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_REFEREE_FROM_MATCH(this.mRefereesFillter[indexMain].getRefereeID(), this.mLeagueID, this.mMatchID);
                Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_REFEREE_INTO_MATCH(referee.getRefereeID(), this.mLeagueID, this.mMatchID, role - 1)
              });
            }

          });
        }
      } else {
        /**Chưa có trọng tài chính */
        let index = this.mRefereesInMatch.findIndex(refere => {
          return refere.getRefereeID() == referee.getRefereeID();
        })

        if (index > -1) {
          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(referee.getRefereeID(), this.mLeagueID, this.mMatchID, role - 1);
          });
        } else {
          this.mAppModule.showLoading().then(() => {
            Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_REFEREE_INTO_MATCH(referee.getRefereeID(), this.mLeagueID, this.mMatchID, role - 1)
          });
        }
      }
    } else {

      let index = this.mRefereesInMatch.findIndex(refere => {
        return refere.getRefereeID() == referee.getRefereeID();
      })

      if (index > -1) {
        this.mAppModule.showLoading().then(() => {
          Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(referee.getRefereeID(), this.mLeagueID, this.mMatchID, role - 1);
        });
      } else {
        this.mAppModule.showLoading().then(() => {
          Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_REFEREE_INTO_MATCH(referee.getRefereeID(), this.mLeagueID, this.mMatchID, role - 1)
        });
      }
    }

  }



  doUpdateRefereeInMatch(referee: RefereeInMatch, role: number) {
    let newRole = role - 1;
    this.mAppModule.doLogConsole("newRole", newRole);
    if (newRole == 1) {
      let indexMain = this.onCheckIndexOfMainRefereeFillter();
      if (indexMain > -1) {
        let refereeIndex = this.mRefereesFillter.findIndex(ref => {
          return ref.getRefereeID() == referee.getRefereeID();
        })
        if (refereeIndex == indexMain) {
          this.mAppModule.showToast("Người này đã là trọng tài chính");
        } else {
          this.showConfirmMessage(() => {
            this.mRefereesFillter[indexMain].setRefereeRole(referee.getRefereeRole());
            referee.setRefereeRole(role - 1);
          });
        }
      } else {
        referee.setRefereeRole(role - 1);
      }
    } else {
      referee.setRefereeRole(newRole);
    }
  }

  onCheckIndexOfMainRefereeFillter(): number {
    if (this.mRefereesFillter.length == 0) return -1;
    return this.mRefereesFillter.findIndex(referee => {
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


  onClickCheckMark() {
    if (this.mMatchID == -1) {
      this.mRefereesInMatch = [];
      this.mRefereesFillter.forEach(referee => {
        if (referee.getRefereeRole() > 0) {
          this.mRefereesInMatch.push(referee);
        }
      });
      this.mViewController.dismiss(this.mRefereesInMatch);
    } else {
      this.navCtrl.pop();
    }
  }
}
