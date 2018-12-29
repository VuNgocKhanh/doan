import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Rounds } from '../../providers/classes/rounds';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Leagues } from '../../providers/classes/league';
import { Group } from '../../providers/classes/group';
import { ClubInLeague } from '../../providers/classes/clubinleague';

/**
 * Generated class for the Bd69ListRoundsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ListGroupModels{
  group: Group;
  clubInGroups: Array<ClubInLeague>;
}

@IonicPage()
@Component({
  selector: 'page-bd69-list-rounds',
  templateUrl: 'bd69-list-rounds.html',
})
export class Bd69ListRoundsPage {

  mRounds: Array<Rounds> = [];

  mGroups: Array<Group> = [];

  mLeague: Leagues = new Leagues();

  idSelected: number = 0;

  mClubInLeagues: Array<ClubInLeague> = [];

  mGroupModels: Array<ListGroupModels> = [];

  buttons: Array<{ id: number, name: string }> = [
    { id: 0, name: "Vòng đấu" },
    { id: 1, name: "Bảng đấu" }
  ];

  isLoadClub: boolean = false;

  isLoadGroup: boolean = false;

  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();

  }

  onClickTab(item) {
    this.idSelected = item.id;
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague.setLeagueID(this.navParams.get("params"));
    }
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69ListRoundsPage", respone => {
        this.onExtendsionRespone(respone);
      });
      this.mAppModule.getLeagueManager().getClubInLeague(this.mLeague.getLeagueID());
      this.mAppModule.getLeagueManager().sendRequestGetListGroupOfLeague(this.mLeague.getLeagueID());
      this.mAppModule.getLeagueManager().sendRequestGET_LIST_ROUND_OF_LEAGUE(this.mLeague.getLeagueID());
    });

    this.mAppModule._subcribleEvent("loaddata",()=>{
      if(this.isLoadClub && this.isLoadGroup){
        this._onMergeClubInGroup();
        this.mAppModule._unsubcribleEvent("loaddata");
      }
    });
  }

  _onGetClubInGroupByGroupID(groupID: number): Array<ClubInLeague>{
      if(this.mClubInLeagues.length == 0){
        return [];
      }
      let res = [];
      this.mClubInLeagues.forEach(club=>{
        if(club.getGroupID() == groupID){
          res.push(club);
        }
      });
      return res;
  }

  _onMergeClubInGroup(){
    if(this.mGroups.length == 0)return;
    this.mGroupModels = [];
    this.mGroups.forEach(group=>{
      this.mGroupModels.push({
        group: group,
        clubInGroups: this._onGetClubInGroupByGroupID(group.getGroupID())
      });
    });
    
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69ListRoundsPage");
  }

  onResponeGetClubInLeague(params) {
    this.isLoadClub = true;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mClubInLeagues = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
      this.mAppModule._createEvent("loaddata");
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetListGroupInLeague(params) {
    this.isLoadGroup = true;
    if (params.getInt(ParamsKey.STATUS) == 1) {
    this.mGroups = this.mAppModule.getLeagueManager().onParseGroupList(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
    this.mAppModule._createEvent("loaddata");
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetListRoundOfLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mRounds = this.mAppModule.getLeagueManager().onParseRoundList(params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY));
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRemoveRoundFromLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let roundID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.ROUND_ID);
      let index = this.mRounds.findIndex(round => {
        return round.getRoundiD() == roundID;
      })
      if (index > -1) {
        this.mRounds.splice(index, 1);
      }
    }
    else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateLeagueRound(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      let info = content.getSFSObject(ParamsKey.INFO);
      let roundID = content.getInt(ParamsKey.ROUND_ID);
      let index = this.mRounds.findIndex(round => {
        return round.getRoundiD() == roundID;
      });
      if (index > -1) {
        this.mRounds[index].fromSFSObject(info);
      }
    }
    else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddRoundIntoLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content.containsKey(ParamsKey.ITEM)) {
        let newRound = new Rounds();
        newRound.fromSFSObject(content.getSFSObject(ParamsKey.ITEM));
        this.mRounds.push(newRound);
      }

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddGroupIntoLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
      this.onAddGroupIntoLeagueSucess(info);

    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeRemoveGroupFromLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let groupID: number = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.GROUP_ID);
      let index = this.mGroups.findIndex(group => {
        return group.getGroupID() == groupID;
      });
      if (index > -1) {
        this.mGroups.splice(index, 1);
        this._onMergeClubInGroup();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateGroupIntoLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);

      let groupID: number = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.GROUP_ID);
      let index = this.mGroups.findIndex(group => {
        return group.getGroupID() == groupID;
      });
      if (index > -1) {
        this.mGroups[index].fromSFSObject(info);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateClubInLeagueInfo(params){
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let info = params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO);
      let clubID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.CLUB_ID);
      let index = this.mClubInLeagues.findIndex(club => {
        return club.getClubID() == clubID;
      });
      if (index > -1) {
        this.mClubInLeagues[index].onFromSFSobject(info);
        this._onMergeClubInGroup();
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_CLUB_IN_LEAGUE) {
      this.onResponeGetClubInLeague(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_GROUP_OF_LEAGUE) {
      this.onResponeGetListGroupInLeague(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_ROUND_OF_LEAGUE) {
      this.onResponeGetListRoundOfLeague(params);
    } else if (cmd == Bd69SFSCmd.REMOVE_ROUND_FROM_LEAGUE) {
      this.mAppModule.hideLoading();
      this.onResponeRemoveRoundFromLeague(params);
    } else if (cmd == Bd69SFSCmd.UPDATE_LEAGUE_ROUND) {
      this.mAppModule.hideLoading();
      this.onResponeUpdateLeagueRound(params);
    } else if (cmd == Bd69SFSCmd.ADD_ROUND_INTO_LEAGUE) {
      this.mAppModule.hideLoading();
      this.onResponeAddRoundIntoLeague(params);
    } else if (cmd == Bd69SFSCmd.ADD_GROUP_INTO_LEAGUE) {
      this.mAppModule.hideLoading();
      this.onResponeAddGroupIntoLeague(params);
    } else if (cmd == Bd69SFSCmd.REMOVE_GROUP_FROM_LEAGUE) {
      this.mAppModule.hideLoading();
      this.onResponeRemoveGroupFromLeague(params);
    } else if (cmd == Bd69SFSCmd.UPDATE_GROUP_IN_LEAGUE) {
      this.mAppModule.hideLoading();
      this.onResponeUpdateGroupIntoLeague(params);
    } else if (cmd == Bd69SFSCmd.UPDATE_CLUB_IN_LEAGUE_INFO) {
      this.onResponeUpdateClubInLeagueInfo(params);
    }

  }

  onClickClubInGroup(club: ClubInLeague){
    let options = [
      {id: 1, name: "Xem thông tin"},
      {id: 2, name: "Xóa khỏi bảng đấu"}
    ];

    this.mAppModule.showActionSheet(club.getName(),options,(id)=>{
      if(id){
        if(id ==1 ){
          this.goToClubInLeagueInfo(club.getClubID());
        }else{
          this.removeClubFromGroup(club.getClubID());
        }
      }
    })
  }

  goToClubInLeagueInfo(clubID : number){
    this.navCtrl.push("ListPlayerPage", {params : {leagueID: this.mLeague.getLeagueID(),clubID: clubID}});
  }

  removeClubFromGroup(clubID: number){
    this.mAppModule.showLoading().then(()=>{
      this.mAppModule.getLeagueManager().sendRequestADD_CLUB_INTO_GROUP(clubID, this.mLeague.getLeagueID(), -1);
    });
  }

  onAddGroupIntoLeagueSucess(info) {
    /**Tạo thành công group */
    let newGroup = new Group();
    newGroup.fromSFSObject(info);
    this.mGroups.push(newGroup);
    this._onMergeClubInGroup();
    /**Thêm câu lạc bộ vào bảng */
    // this._onAddClubIntoGroup(newGroup.getGroupID());
  }

  getGroupNameByID(groupID: number): string {
    for (let group of this.mGroups) {
      if (group.getGroupID() == groupID) {
        return group.getName();
      }
    }
    return "";
  }

  _onAddClubIntoGroup(groupID: number) {
    // let arrayClub = this._onGetClubNotHaveGroupId();
    this.mClubInLeagues.sort((a,b)=>{
      return a.getGroupID() - b.getGroupID();
    });
    if (this.mClubInLeagues.length == 0) {
      this.mAppModule.showToast("Chưa có câu lạc bộ nào trong giải đấu");
    } else {
      let arryInput = [];
      this.mClubInLeagues.forEach(club => {
        let groupName = this.getGroupNameByID(club.getGroupID());
        arryInput.push({
          id: club.getClubID(),
          name: groupName ? club.getName() + "(" + groupName+ ")" : club.getName(),
          checked: false
        });
      });
      this.mAppModule.showRadioMulti(this.getGroupNameByID(groupID), arryInput, (data) => {
        if (data) {
          data.forEach(id => {
            let clubId = parseInt(id);
            this.mAppModule.getLeagueManager().sendRequestADD_CLUB_INTO_GROUP(clubId, this.mLeague.getLeagueID(), groupID);
          });
        }
      });
    }
  }

  _onGetClubNotHaveGroupId(): Array<ClubInLeague> {
    let res = [];
    this.mClubInLeagues.forEach(club => {
      if (club.getGroupID() == -1) {
        res.push(club);
      }
    });
    return res;
  }

  onClickRound($event) {
    let round = $event.round;
    let index = $event.index;
    this._onShowActionSheetRound(round, index);
  }

  _onShowActionSheetRound(round: Rounds, index: number) {
    let array = [
      { id: 0, name: "Chỉnh sửa tên vòng đấu" },
      { id: 1, name: "Xoá" }
    ];
    this.mAppModule.showActionSheet(round.getName(), array, (id) => {
      if (id == 0) {
        this.onGetRoundEdit(round);
        return;
      }
      if (id == 1) {
        this.onGetRoundDelete(round);
      }
    });
  }

  onGetRoundEdit(round: Rounds) {
    this.mAppModule.showPromt("Chỉnh sửa tên vòng đấu", (name) => {
      if (name) {
        round.setName(name);
        if (round.getRoundiD() > -1) {
          this.mAppModule.showLoading().then(() => {
            this.mAppModule.getLeagueManager().sendRequestUPDATE_LEAGUE_ROUND(round);
          })
        }
      }
    }, round.getName());
  }

  onClickAddRound() {
    this.mAppModule.showPromt("Thêm vòng đấu", (name) => {
      if (name) {
        let newRound = new Rounds();
        newRound.setName(name);
        newRound.setLeagueID(this.mLeague.getLeagueID());

        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestADD_ROUND_INTO_LEAGUE(this.mLeague.getLeagueID(), [newRound]);
        });
      }
    });
  }

  onGetRoundDelete(round: Rounds) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getLeagueManager().sendRequestREMOVE_ROUND_FROM_LEAGUE(round);
    });
  }

  onClickGroup(item: Group) {
    let array = [
      { id: 0, name: "Thêm câu lạc bộ vào bảng đấu" },
      { id: 1, name: "Cập nhật tên bảng đấu" },
      { id: 2, name: "Xoá bảng đấu" }
    ];
    this.mAppModule.showActionSheet(item.getName(), array, (id) => {
      if (id == 0) {
        this._onAddClubIntoGroup(item.getGroupID());
        return;
      }
      if (id == 1) {
        this.mAppModule.showPromt("Cập nhập tên bảng đấu", (name) => {
          if (name) {
            item.setName(name);
            /**Cập nhật tên bảng đấu */
            this.mAppModule.showLoading().then(() => {
              this.mAppModule.getLeagueManager().sendRequestUPDATE_GROUP_IN_LEAGUE(item);
            });
          }
        }, item.getName());
        return;
      }
      if (id == 2) {
        /**Xoá group */
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestRemoveGroupFromLeague(item.getLeagueID(), item.getGroupID());
        });
        return;
      }
    })
  }

  onClickAddGroup() {
    if(this.idSelected == 1){
      this.mAppModule.showPromt("Tạo bảng đấu", (name) => {
        if (name) {
          /**Tạo mới bảng đấu */
          this.mAppModule.showLoading().then(() => {
            this.mAppModule.getLeagueManager().sendRequestAddGroupIntoLeague(this.mLeague.getLeagueID(), name);
          });
        }
      });
    }else{
      this.onClickAddRound();
    }
  }
}
