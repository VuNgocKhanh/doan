import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Player } from '../../providers/classes/player';
import { RoleInClub, RequestState, ConstantManager } from '../../providers/manager/constant-manager';
import { User } from '../../providers/classes/user';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Clubs } from '../../providers/classes/clubs';
import { AppManager } from '../../providers/manager/app-manager';

/**
 * Generated class for the ManagerMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-member',
  templateUrl: 'manager-member.html',
})
export class ManagerMemberPage {
  manager_member = "Danh sách thành viên";

  mListPlayer: Array<Player> = [];

  role: number = RoleInClub.GUEST;

  mRole: number = 0;

  clubID: number = -1;

  isDidEnter = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.clubID = params["clubID"];
      this.mRole = params["role"];
    }
  }


  onLoadData() {
    this.mAppModule.getClubManager().sendRequestGetPlayerInClub(this.clubID, -1);
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("ManagerMemberPage", respone => {
        this.onExtensionRespone(respone);
      })
      this.onLoadData();
    })
  }

  ionViewDidEnter() {
    if (this.isDidEnter == 1) {
      this.onLoadData();
    }
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("ManagerMemberPage");
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_USER_IN_CLUB) {
      this.onResponseGetUserInClub(params);
    }
    else if (cmd == Bd69SFSCmd.REMOVE_USER_OF_CLUB) {
      this.onResponseRemoveUserOfClub(params);
    }
    else if (cmd == Bd69SFSCmd.CHANGE_USER_ROLE_IN_CLUB) {
      this.onResponseChangeUserRole(params);
    }
  }


  onResponseGetUserInClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);

      if (content) {
        let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
        let clubID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.CLUB_ID);

        let mListPlayer: Array<Player> = [];

        for (let i = 0; i < sfsArray.size(); i++) {
          let sfsdata = sfsArray.getSFSObject(i);
          let newPlayer = new Player();
          newPlayer.fromSFSObject(sfsdata);
          newPlayer.onResponeSFSObject(sfsdata);
          newPlayer.setClubID(clubID);

          mListPlayer.push(newPlayer);
        }
        this.mListPlayer = mListPlayer;
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponseRemoveUserOfClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Xóa thành viên thành công");

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let playerID = content.getInt(ParamsKey.PLAYER_ID);

        if (clubID == this.clubID && playerID != this.mAppModule.getUserManager().getUser().getUserID()) {
          let indexOfUser = this.mListPlayer.findIndex(user => {
            return user.getUserID() == playerID;
          });
          if (indexOfUser != -1) this.mListPlayer = this.mListPlayer.splice(indexOfUser, 1);
        }
      }
    }
    else {
      this.mAppModule.showParamsMessage(params);
    }
    this.mAppModule.hideLoading();
  }

  onResponseChangeUserRole(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.getInt(ParamsKey.ROLE) == 1) {
        this.mListPlayer.forEach(player => {
          if(player.getRoleInClub() == 1){
            player.setRoleInClub(0);
          }
        });
        let playerID = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayer.findIndex(player => {
          return player.getPlayerID() == playerID
        });
        if (index > -1) {
          this.mListPlayer[index].setRoleInClub(1);
        }
      } else {
        let playerID = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayer.findIndex(player => {
          return player.getPlayerID() == playerID
        });
        if (index > -1) {
          this.mListPlayer[index].setRoleInClub(0);
        }
      }
    }
    this.mAppModule.hideLoading();
  }

  onClickAddMember() {
    this.isDidEnter = 1;
    this.navCtrl.push("AddMemberPage", { params: this.clubID });
  }

  onClickPlayer(player: Player) {
    if (this.mAppModule.getUserManager().getUser().getUserID() == player.getPlayerID()) {
      this.goToInfoPlayer(player);
    } else if (this.mRole > 1) {
      let mListActionSheet: Array<{ id: number, name: string }> = []
      if (player.getRoleInClub() == RoleInClub.CAPTAIN) {
        mListActionSheet = [
          { id: 0, name: "Xem thông tin" },
          { id: 3, name: "Hủy đội trưởng" },
          { id: 2, name: "Yêu cầu rời đội" }
        ]
      } else {
        mListActionSheet = [
          { id: 0, name: "Xem thông tin" },
          { id: 1, name: "Chọn làm đội trưởng" },
          { id: 2, name: "Yêu cầu rời đội" }
        ]
      }

      this.mAppModule.showActionSheet(player.getName(), mListActionSheet, (res) => {
        this.onSelectAction(res, player);
      })
    } else {
      this.goToInfoPlayer(player);
    }


  }
  onSelectAction(res, player: Player) {
    if (res == 0) {
      this.goToInfoPlayer(player);
    } else if (res == 1) {
      this.onSetManager(this.clubID, player.getPlayerID(), RoleInClub.CAPTAIN);
    } else if (res == 2) {
      this.onKickMember(this.clubID, player.getPlayerID());
    } else if (res == 3) {
      this.onSetManager(this.clubID, player.getPlayerID(), RoleInClub.MEMBER);
    }
  }

  goToInfoPlayer(player: Player) {
    this.navCtrl.push("PlayerInfoInClubPage", { params: { playerID: player.getPlayerID(), clubID: player.getClubID() } });
  }

  onSetManager(clubID: number, playerID: number, roleInClub: number) {

    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getClubManager().sendRequestChangeRole(clubID, playerID, roleInClub);
    });
  }

  onKickMember(clubID: number, playerID: number) {
    this.mAppModule.showAlert("Bạn có chắc muốn cầu thủ này rời đội?", callback =>{
      if(callback == 1){
        this.mAppModule.showLoading().then(() => {
        this.mAppModule.getClubManager().sendRequestKickPlayer(clubID, playerID);
        });
      }     
    });   
 }


  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }

}