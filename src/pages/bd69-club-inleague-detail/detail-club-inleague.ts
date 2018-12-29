import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clubs } from '../../providers/classes/clubs';
import { Player } from '../../providers/classes/player';

/**
 * Generated class for the DetailClubInleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-detail-club-inleague',
  templateUrl: 'detail-club-inleague.html',
})
export class DetailClubInleaguePage {

 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
