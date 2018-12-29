import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SelectTimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-time',
  templateUrl: 'select-time.html',
})
export class SelectTimePage {

  constructor(
    public mViewController: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();

  }

  ionViewDidLoad() {
  }
  centerIndexs: Array<number> = [0,0];
  getChange($event){
  }

  onLoadParams(){
    if(this.navParams.data["params"]){
      this.centerIndexs = this.navParams.get("params");
    }
  }

  closeView(){
    this.mViewController.dismiss(this.centerIndexs);
  }
  
}
