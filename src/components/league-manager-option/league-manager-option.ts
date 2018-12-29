import { Component, Input } from '@angular/core';
import { Leagues } from '../../providers/classes/league';
import { ConstantManager } from '../../providers/manager/constant-manager';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the LeagueManagerOptionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'league-manager-option',
  templateUrl: 'league-manager-option.html'
})
export class LeagueManagerOptionComponent {

  @Input("league") mLeague: Leagues = new Leagues();

  mListOptions: Array<{ id: number, name: string, icon: string, page: string }> = [];

  constructor(public navCtrl: NavController) {
    this.mListOptions = ConstantManager.getInstance().getListLeagueManagerItems();
  }

  onClickOption(option) {
    if (option.page) {
      this.navCtrl.push(option.page, { params: this.mLeague.getLeagueID() });
    }
  }

  onClickLeagueName() {
    this.navCtrl.push("Bd69ProfileLeaguePage", { params: this.mLeague });
  }
}
