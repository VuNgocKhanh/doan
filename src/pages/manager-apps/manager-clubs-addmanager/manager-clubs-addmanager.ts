import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, ViewController } from 'ionic-angular';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { AppManager } from '../../../providers/manager/app-manager';
import { Player } from '../../../providers/classes/player';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Utils } from '../../../providers/core/app/utils';

/**
 * Generated class for the ManagerClubsAddmanagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-clubs-addmanager',
  templateUrl: 'manager-clubs-addmanager.html',
})
export class ManagerClubsAddmanagerPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  clubID: number = -1;

  mUserName: string = "";

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  page: number = 0;

  mListUser: Array<User> = [];
  mListUserFillter: Array<User> = [];

  mListActionSheet: Array<{ id: number, name: string }> = [];

  mListPlayers : Array<Player> = [];

  mListPlayersFillter : Array<Player> = [];

  isLoading: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
    this.onLoadParams();
    this.onLoadActionSheet();
  }

  onLoadData(){
    Bd69SFSConnector.getInstance().sendRequestGetUserInClub(this.clubID,this.nextPage);
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.clubID = this.navParams.get("params");
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mSearchBar.setFocus();
    }, 1000);
  }

  onLoadActionSheet() {
    this.mListActionSheet = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Chọn làm lãnh đội" }
    ];
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerClubsAddmanagerPage", respone => {
        this.onExtensionResponse(respone);
      });

      this.onLoadData();
    });
  }


  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ManagerClubsAddmanagerPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if(cmd == Bd69SFSCmd.GET_USER_IN_CLUB){
      this.onResponeGetUserInClub(params);
    }
    else if (cmd == Bd69SFSCmd.SEARCH_USER) {
      this.isSearchData = false;
      this.onParseListUserParams(params);
    } else if (cmd == Bd69SFSCmd.APP_UPDATE_CLUB_MANAGER) {
      this.onResponeUpdateClubManager(params);
    }
  }

  onResponeGetUserInClub(params){
    this.isLoading = false;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {

        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        }else{
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);

        let arrayPlayers = this.mAppModule.getPlayerManager().onParsePlayer(params,this.clubID);

        if(this.page < 1){
          this.mListPlayers = arrayPlayers;
        }else{
          this.mListPlayers = this.mListPlayers.concat(arrayPlayers);
        }
        this.mListPlayersFillter = this.mListPlayers;
        
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeUpdateClubManager(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let dismisInfo = {
          clubID: content.getInt(ParamsKey.CLUB_ID),
          name: this.mUserName
        }
        this.mAppModule.showToast("Cập nhật lãnh đội thành công");
        this.mViewController.dismiss(dismisInfo);
      } 
    }else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListUserParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        }else{
          this.nextPage = -1;
        }

        if (content.containsKey(ParamsKey.PAGE)) {
          this.page = content.getInt(ParamsKey.PAGE);
        }

        if (content.containsKey(ParamsKey.ARRAY)) {
          let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
          let mListUser: Array<User> = []
          for (let i = 0; i < sfsArray.size(); i++) {
            let sfsObject = sfsArray.getSFSObject(i);
            let newUser = new User();
            newUser.fromSFSObject(sfsObject);

            mListUser.push(newUser);
          }

          if (this.page < 1) {
            this.mListUser = mListUser;
          } else {
            this.mListUser.concat(mListUser);
          }

          this.mListUserFillter = this.mListUser;
        }
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
  }

  isSearchData: boolean = false;
  onClickSearch(infinite?:boolean) {
    if(this.isSearchData) return;
    if(this.searchQuery.trim() != ""){
      this.isSearchData = true;
      if(this.oldSearchQuery != this.searchQuery){
        this.page = 0;
        this.nextPage = 0;
      }
      if(this.nextPage == -1) return;
      if(infinite){
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
        });
      }else{
        this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);
      }
    }
  }

  onClickPlayer(player: Player){
    this.mAppModule.showActionSheet(player.getName(), this.mListActionSheet, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(player.getPlayerID());
        } else {
          this.doUpdateManagerClub(player.getPlayerID());
        }
      }
    })
  }

  onClickUser(user: User) {
    this.mAppModule.showActionSheet(user.getName(), this.mListActionSheet, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(user.getUserID());
        } else {
          this.doUpdateManagerClub(user.getUserID());
        }
      }
    })
  }

  goToProfileUser(userID: number) {
    this.navCtrl.push("ProfilePage", {params: userID});
  }

  doUpdateManagerClub(userID: number) {
    AppManager.getInstance().sendRequestAPP_UPDATE_CLUB_MANAGER(userID, this.clubID);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if(this.searchQuery.trim() != ''){
        this.onClickSearch();
      }else{
        this.onLoadData();
      }
      infiniteScroll.complete();
    }, 1000);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.nextPage = 0;
      this.mAppModule.getUserManager().sendRequestSearchUser(this.searchQuery, this.nextPage);

      refresher.complete();
    }, 1500);
  }


  doSearchLocal(){
    if(this.searchQuery.trim() != ""){
      this.mListPlayers = this.mListPlayersFillter.filter(player=>{
        return Utils.bodauTiengViet(player.getName().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery.toLowerCase()));
      });

      this.mListUser = this.mListUserFillter.filter(player=>{
        return Utils.bodauTiengViet(player.getName().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery.toLowerCase()));
      });

    }else{
      this.nextPage = 0;
      this.mListPlayers = this.mListPlayersFillter;
      this.mListUser = this.mListUserFillter;
    }
  }
}
