import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { User } from '../../../providers/classes/user';
import { Utils } from '../../../providers/core/app/utils';
import { Player } from '../../../providers/classes/player';

/**
 * Generated class for the MatchEventAddnewSelectPlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match-event-addnew-select-player',
  templateUrl: 'match-event-addnew-select-player.html',
})
export class MatchEventAddnewSelectPlayerPage {
  @ViewChild(Searchbar) mSeachBar: Searchbar;

  mListPlayer: Array<Player> = [];

  mListPlayerFillter: Array<Player> = [];

  searchQuery: string = "";

  mPlayerSelected: Player = new Player();

  constructor(
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();

  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.mSeachBar.setFocus();
    }, 500);
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mListPlayer = this.navParams.get("params");
      this.mListPlayerFillter = this.mListPlayer;
    }
  }

  doSearchPlayer() {
    if (this.searchQuery.trim() != "") {
      this.mListPlayerFillter = this.mListPlayer.filter(user => {
        return Utils.bodauTiengViet(user.getName()).toLowerCase().includes(Utils.bodauTiengViet(this.searchQuery).toLowerCase());
      })
    } else {
      this.mListPlayerFillter = this.mListPlayer;
    }
  }

  onClickSave() {
    this.mAppModule.doLogConsole("player", this.mPlayerSelected);
    
    if (this.mPlayerSelected.getPlayerID() > -1) {
      this.mViewController.dismiss(this.mPlayerSelected);
    } else {
      this.mAppModule.doLogConsole("player name", this.mPlayerSelected.getName());
      this.mAppModule.showToast("Bạn chưa chọn cầu thủ nào !");
    }
  }

  
}
