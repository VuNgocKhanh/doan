import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DevelopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-develop',
  templateUrl: 'develop.html',
})
export class DevelopPage {
  title : string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.onLoadParams();   
  }

  onLoadParams(){
    if(this.navParams.data['title']){
      this.title = this.navParams.get("title");
    }
  }

  onClickBack(){
    this.navCtrl.pop();
  }
}
