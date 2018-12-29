import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UsersAppInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-app-info',
  templateUrl: 'users-app-info.html',
})
export class UsersAppInfoPage {

  name = "Bóng đá 69";
  version = "1.0.0";

  listInfo: Array<{ id: number, name: string, value: string }> = [
    { id: 0, name: "website:", value: "Chưa cập nhật" },
    { id: 1, name: "facebook:", value: "Chưa cập nhật" },
    { id: 2, name: "hotline:", value: "Chưa cập nhật" },
    { id: 3, name: "address:", value: "Chưa cập nhật" },
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
