import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../providers/classes/league';
import { RecordItems } from '../../providers/classes/recorditem';

/**
 * Generated class for the ProfileLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-list',
  templateUrl: 'profile-list.html',
})
export class ProfileListPage {
  items: Array<{ name: string, page: string }> = [
    { name: "Hồ sơ cầu thủ", page: "ProfileUserPage" }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.onLoadParams();
  }

  onClickDetailProfile(item: any) {
    this.navCtrl.push(item.page, { params: this.mLeague.getLeagueID()});
  }

  mLeague: Leagues = new Leagues();
  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague.setLeagueID(this.navParams.get("params"));
    }
  }

}
