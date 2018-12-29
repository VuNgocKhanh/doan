import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

export interface Sponsor{
  name: string;
  logo : string;
}

@IonicPage()
@Component({
  selector: 'page-sponsor-list',
  templateUrl: 'sponsor-list.html',
})
export class SponsorListPage {

  sponsorList : Array<Sponsor> = [
    {name : "B-gate", logo: "https://i.ytimg.com/vi/XY5CEnS-qwk/maxresdefault.jpg"},
    {name : "B-gate", logo: "https://i.ytimg.com/vi/XY5CEnS-qwk/maxresdefault.jpg"},
    {name : "B-gate", logo: "https://i.ytimg.com/vi/XY5CEnS-qwk/maxresdefault.jpg"},
    {name : "B-gate", logo: "https://i.ytimg.com/vi/XY5CEnS-qwk/maxresdefault.jpg"},
    {name : "B-gate", logo: "https://i.ytimg.com/vi/XY5CEnS-qwk/maxresdefault.jpg"},
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
