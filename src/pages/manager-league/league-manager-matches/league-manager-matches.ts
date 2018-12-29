import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConstantManager } from '../../../providers/manager/constant-manager';

/**
 * Generated class for the LeagueManagerMatchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-league-manager-matches',
  templateUrl: 'league-manager-matches.html',
})
export class LeagueManagerMatchesPage {

  items: Array<{id: number, name: string, page: string, class: string, icon: string}> = [];

  mLeagueID: number = -1;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
    this.onLoadItems();
  }

  onClickItem(item){
    if(item.page){
      this.navCtrl.push(item.page, {params: this.mLeagueID});
    }
  }

  onLoadItems(){
    this.items = ConstantManager.getInstance().getListItemManagerMatch();
  }

  onLoadParams(){
    if(this.navParams.data["params"]){
      this.mLeagueID = this.navParams.get("params");
    }
  }
}
