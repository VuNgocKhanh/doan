import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface Group{
  name  : string;
  member : number;
  avatar : string;
}

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  groups : Array<Group> = [ 
    {name: "FC Barcelona", member : 10, avatar: ""},
    {name: "FC Arsenal", member: 20, avatar:""}
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
