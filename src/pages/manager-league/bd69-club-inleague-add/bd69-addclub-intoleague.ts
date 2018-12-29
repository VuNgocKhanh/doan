import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { Clubs } from '../../../providers/classes/clubs';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';

/**
 * Generated class for the Bd69AddclubIntoleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface ListClubsModel {
  club: Clubs;
  isMember: boolean;
}

@IonicPage()
@Component({
  selector: 'page-bd69-addclub-intoleague',
  templateUrl: 'bd69-addclub-intoleague.html',
})
export class Bd69AddclubIntoleaguePage {

  mListClubInLeagues: Array<ClubInLeague> = [];

  mListClubModels: Array<ListClubsModel> = [];

  searchQuery: string = "";

  oldSearchQuery: string = "";

  page: number = 0;

  nextPage: number = 0;

  mLeagueID: number = -1;

  constructor(
    private mAlertController: AlertController,
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_CLUB(this.mLeagueID);
    Bd69SFSConnector.getInstance().sendRequestSearchClub("a", this.nextPage);
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
      this.mAppModule.doLogConsole("leagueid ", this.mLeagueID);
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
    }
    Bd69SFSConnector.getInstance().addListener("Bd69AddclubIntoleaguePage", respone => {
      this.onExtensionResponse(respone);
    })

    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69AddclubIntoleaguePage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_CLUB) {
      this.onResponeGetClubInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.SEARCH_CLUB) {
      this.onResponeSearchClub(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_CLUB) {
      this.onResponeRemoveClubFromLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_ADD_CLUB) {
      this.onResponeAddClubIntoLeague(params);
    }
  }

  onResponeRemoveClubFromLeague(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let index = this.mListClubModels.findIndex(item => {
          return item.club.getClubID() == clubID;
        })

        if (index > -1) {
          this.mListClubModels[index].isMember = false;

          let indexClub = this.mListClubInLeagues.findIndex(club => {
            return club.getClubID() == clubID;
          })

          if (indexClub > -1) {
            this.mListClubInLeagues.splice(indexClub, 1);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeAddClubIntoLeague(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let clubID = content.getInt(ParamsKey.CLUB_ID);
        let index = this.mListClubModels.findIndex(item => {
          return item.club.getClubID() == clubID;
        })

        if (index > -1) {
          this.mListClubModels[index].isMember = true;
          let newCLub = new ClubInLeague();
          newCLub.fromClubs(this.mListClubModels[index].club);
          newCLub.setLeagueID(this.mLeagueID);
          this.mAppModule.showToast("Đã thêm câu lạc bộ " + newCLub.getName() + " vào giải đấu");
          this.mListClubInLeagues.push(newCLub);
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
          this.mListClubInLeagues = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeSearchClub(params) {

    this.mAppModule.hideLoading();

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
          let arrayClubs = this.mAppModule.getClubManager().onParseSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          this.onResponeSFSClubArray(arrayClubs);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }
  onResponeSFSClubArray(arrayClubs: Array<Clubs>) {
    if (this.page < 1) {
      this.mListClubModels = [];
    }

    arrayClubs.forEach(element => {
      this.mListClubModels.push({
        club: element,
        isMember: this.onCheckClubIsMember(element.getClubID())
      })
    });
  }

  onCheckClubIsMember(clubId: number): boolean {
    let check = false;
    for (let i = 0; i < this.mListClubInLeagues.length; i++) {
      if (this.mListClubInLeagues[i].getClubID() == clubId) {
        check = true;
        break;
      }
    }
    return check;
  }

  onClickSearch(infinite?: boolean) {

    if (this.searchQuery.trim() != '') {
      if (this.searchQuery != this.oldSearchQuery) {
        this.oldSearchQuery = this.searchQuery;
        this.nextPage = 0;
        this.page = 0;
      }

      if (this.nextPage == -1) return;

      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          Bd69SFSConnector.getInstance().sendRequestSearchClub(this.searchQuery, this.nextPage);
        })
      } else {
        Bd69SFSConnector.getInstance().sendRequestSearchClub(this.searchQuery, this.nextPage);
      }
    }
  }

  clearQuery(){
    this.searchQuery = "";
    this.nextPage = 0;
    Bd69SFSConnector.getInstance().sendRequestSearchClub("a", this.nextPage);

  }

  doSearchLocal(){
    if(this.searchQuery.trim() == ""){
      this.nextPage = 0;
      Bd69SFSConnector.getInstance().sendRequestSearchClub("a", this.nextPage);
    }
  }

  onClickClub(item: ListClubsModel) {
    let options = [
      { id: 1, name: "Xem thông tin" },
      { id: 2, name: "Xóa khỏi giải đấu" }
    ];

    if (!item.isMember) {
      options[1].name = "Thêm vào giải đấu";
    }

    this.mAppModule.showActionSheet(item.club.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToViewClub(item.club.getClubID());
        } else {
          if (item.isMember) {
            this.doRemoveClub(item.club);
          } else {
            this.doAddClub(item.club);
          }
        }
      }
    });
  }

  goToViewClub(clubID: number) {
    this.navCtrl.push("ViewClubPage", { params: { clubID: clubID } });
  }

  doRemoveClub(club: Clubs) {
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setMessage("Bạn muốn xóa đội bóng " + club.getName() + " khỏi giải đấu");
    alert.addButton({
      text: "Không"
    });
    alert.addButton({
      text: "Xóa",
      handler: () => {
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_REMOVE_CLUB(club.getClubID(), this.mLeagueID);
        })
      }
    });
    alert.present();
  }

  doAddClub(club: Clubs) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_ADD_CLUB(club.getClubID(), this.mLeagueID, club.getManager().getManagerID());
    });
  }


  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.searchQuery.trim() != '') {
        this.onClickSearch();
      } else {
        Bd69SFSConnector.getInstance().sendRequestSearchClub("a", this.nextPage);
      }
      infiniteScroll.complete();
    }, 1000);
  }

}
