import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UsersQuestionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-question-detail',
  templateUrl: 'users-question-detail.html',
})
export class UsersQuestionDetailPage {

  mQuestion: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    if(this.navParams.get("params")){
      let mData = this.navParams.get("params");
      mData.forEach(question => {
        this.mQuestion.push(question);
      })
    }
  }

  click: number = -1;
  isClick: boolean = true;
  showhideQuestion(index){
    this.click = index;
    this.isClick = !this.isClick;
  }

}
