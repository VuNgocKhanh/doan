import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../../providers/classes/paramkeys';
import { PlayerCards } from '../../../../providers/classes/playercards';
import { Bd69SFSConnector } from '../../../../providers/smartfox/bd69-sfs-connector';
import { PlayerRecordState } from '../../../../providers/manager/constant-manager';
import { ListPlayerModels } from '../../../manager-league/bd69-club-inleague-profile/bd69-clubinleague-detail';
import { PlayerRecordInLeague } from '../../../../providers/classes/player_record_inleague';
import { Player } from '../../../../providers/classes/player';

/**
 * Generated class for the ConfirmProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-profile',
  templateUrl: 'confirm-profile.html',
})
export class ConfirmProfilePage {

  mLeagueID: number = -1;

  mClubID: number = -1;

  mListFormPlayer: Array<PlayerRecordInLeague> = [];

  mListPlayerCards: Array<PlayerCards> = [];

  page: number = 0;

  nextPage: number = 0;

  stepLoadPlayer: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mClubID = params['clubID'];
      this.mLeagueID = params['leagueID'];
    }
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_GET_LIST_PLAYER_FORM(this.mLeagueID, this.mClubID, this.nextPage);
  }


  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule.addBd69SFSResponeListener("ConfirmProfilePage", respone => {
      this.onExtensionResponse(respone);
    });

    this.onLoadData();
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ConfirmProfilePage");
  }

  onExtensionResponse(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_CLUB_GET_LIST_PLAYER_FORM) {
      this.onParseListPlayerFormInLeague(params);
    } else if (cmd == Bd69SFSCmd.CHANGE_PLAYER_FORM_STATE){
      this.onResponeChangePlayerFormState(params);
    }
  }

  onResponeChangePlayerFormState(params){
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        let playerID = content.getInt(ParamsKey.PLAYER_ID);
        let index = this.mListPlayerCards.findIndex(playerCard=>{
          return playerCard.getPlayerID() == playerID;
        });

        if(index > -1){
          if(content.containsKey(ParamsKey.INFO)){
            let state = content.getSFSObject(ParamsKey.INFO).getInt(ParamsKey.STATE);
            this.mListPlayerCards[index].setState(state);
          }
        }
      }
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
        this.onLoadPlayerCards();
      }
    }
  }

  onLoadPlayerCards() {
    this.mListPlayerCards = [];
    this.mListFormPlayer.forEach(player => {
      let newPlayerCard = new PlayerCards();
      newPlayerCard.fromPlayerRecordInLeague(player);
      this.mListPlayerCards.push(newPlayerCard);
    });
  }

  

 

  onClickMemberCard(item: PlayerCards) {
    let options = [
      { id: 1, name: "Xem thông tin " },
      { id: 2, name: "Đánh giá hồ sơ hợp lệ" }
    ];

    if (item.getState() == PlayerRecordState.VALIDATED) {
      options[1].name = "Đánh giá hồ sơ không hợp lệ";
    }

    this.mAppModule.showActionSheetNoDestruc(item.getPlayerName(), options, (id) => {
      if (id) {
        if (id == 1) {
          this.goToProfileUser(item);
        } else {
          if (item.getState() != PlayerRecordState.VALIDATED) {
            this.doUpdateProfile(item, PlayerRecordState.VALIDATED);
          } else {
            this.doUpdateProfile(item, PlayerRecordState.INVALID);
          }
        }
      }
    });
  }

  goToProfileUser(item: PlayerCards) {
    this.navCtrl.push("ProfileUserPage", { players: { playerID: item.getPlayerID(), leagueID: this.mLeagueID, clubID: this.mClubID }, role: 3 });
  }

  doUpdateProfile(player: PlayerCards, state: number) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getLeagueManager().sendRequestChangePlayerFormState(player.getPlayerID(), this.mLeagueID, state);
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onLoadData();
      infiniteScroll.complete();
    }, 1000);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 1500);
  }
}
