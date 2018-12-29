import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/classes/user';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Player } from '../../providers/classes/player';

/**
 * Generated class for the AddMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface UserModels {
  user: User;
  isMember: boolean;
}

@IonicPage()
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {

  add_member = "Thêm thành viên";
  send_invite = "Thêm";
  search = "Tìm kiếm";
  placeholder = "Tìm kiếm cầu thủ";

  showEmpty: boolean = false;

  mListUser: Array<UserModels> = [];

  mListUserInClub: Array<Player> = [];

  searchQuery: string = "";

  oldSearchQuery: string = "";

  page: number = 0;

  nextPage: number = 0;

  isSearchDone: boolean = false;

  mClubID = -1;

  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.mListUser = [];
    this.onLoadParams();
  }

  onLoadData() {
    this.mAppModule.getClubManager().sendRequestGetPlayerInClub(this.mClubID, -1);
    this.mAppModule.getUserManager().sendRequestSearchUser("a", this.nextPage);  
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      Bd69SFSConnector.getInstance().addListener("AddMemberPage", respone => {
        this.onExtensionRespone(respone);
      });
  
      this.onLoadData();
    });

    
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("AddMemberPage");
  }


  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_USER_IN_CLUB) {
      this.onParseUserInClub(params);
    }
    else if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.onResponseSearchUser(params);
    }
    else if (cmd == Bd69SFSCmd.ADD_USER_INTO_CLUB) {
      this.onResponeAddUserInClub(params);
    }
    else if (cmd == Bd69SFSCmd.REMOVE_USER_OF_CLUB){
      this.onResponeRemoveUserOfClub(params);
    }
  }

  onResponeRemoveUserOfClub(params){
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      // this.mAppModule.showToast("Xóa thành viên thành công");

      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let userid = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListUser.findIndex(user=>{
          return user.user.getUserID() == userid;
        })

        if(index > -1){
          this.mListUser[index].isMember = false;
          let indexInClub = this.mListUserInClub.findIndex(player=>{
            return player.getPlayerID() == userid;
          })

          if(indexInClub > -1){
            this.mListUserInClub.splice(index,1);
          }
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddUserInClub(params){
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Thêm thành viên thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let userid = content.getInt(ParamsKey.USER_ID);
        let index = this.mListUser.findIndex(user=>{
          return user.user.getUserID() == userid;
        })

        if(index > -1){
          this.mListUser[index].isMember = true;
          let player = new Player();
          player.fromUser(this.mListUser[index].user);
          this.mListUserInClub.push();
        }

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  onParseUserInClub(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mListUserInClub = [];
          this.mListUserInClub = this.mAppModule.getPlayerManager().onParsePlayer(params,this.mClubID);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }

  onResponseSearchUser(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.nextPage = -1;
        }

        this.page = content.getInt(ParamsKey.PAGE);

        if (content.containsKey(ParamsKey.ARRAY)) {
          let arrayUser = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          this.onParseArrayUserToModels(arrayUser);
          if(arrayUser.length == 0){
            this.showEmpty = true;
          }else{
            this.showEmpty = false;
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mClubID = this.navParams.get("params");
    }
  }

  onParseArrayUserToModels(arrayUser: Array<User>) {
    if(this.page < 1){
      this.mListUser = [];
    }

    arrayUser.forEach(user=>{
      this.mListUser.push({
        user: user,
        isMember: this.onCheckUserIsInClub(user.getUserID())
      });
    });
  }

  onCheckUserIsInClub(userid: number): boolean{
    if(this.mListUserInClub.length == 0) return false;
      for(let userInClub of this.mListUserInClub){
        if(userid == userInClub.getPlayerID()){
          console.log(userid);       
          return true;
        }
      }
    return false;
  }

  searchUser(infinite?: boolean) {
    if (this.searchQuery.trim() != '') {
      if (this.oldSearchQuery != this.searchQuery) {
        this.page = 0;
        this.nextPage = 0;
        this.mListUser = [];
      }
      this.isSearchDone = false;
      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery);
        });

      } else {
        this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery);
      }

    }
  }
  onClickSearchUser() {
    this.searchUser();
  }

  clearQuery(){
    this.nextPage = 0;
    this.searchQuery = "";
    this.mAppModule.getUserManager().sendRequestSearchUser("a", this.nextPage);
  }

  onInput(){
    if(this.searchQuery.trim() == ""){
      this.nextPage = 0;
      this.mAppModule.getUserManager().sendRequestSearchUser("a", this.nextPage);
    }
  }

  onClickUserr(user: UserModels) {
    let options = [
      { id: 1, name: "Xem thông tin " },
      { id: 2, name: "Xoá khỏi đội bóng" }
    ];

    if (!user.isMember) {
      options[1].name = "Thêm vào đội bóng";
    }

    this.mAppModule.showActionSheet(user.user.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToUserProfile(user.user);
        } else {
          if (user.isMember) {
            this.mAppModule.showLoading().then(() => {
              this.mAppModule.getClubManager().sendRequestKickPlayer(this.mClubID, user.user.getUserID());
            });
          } else {
            this.mAppModule.showLoading().then(() => {
              this.mAppModule.getClubManager().sendRequestAddUserIntoClub(user.user.getUserID(), this.mClubID);
            })
          }
        }
      }
    })
  }

  goToUserProfile(user: User) {
    this.navCtrl.push("ProfilePage", {params: user.getUserID()});
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != "") {
        this.searchUser();
      } else {
        this.onLoadData();
      }
      infiniteScroll.complete();
    }, 200);
  }

}
