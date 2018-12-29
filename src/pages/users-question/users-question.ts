import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';

/**
 * Generated class for the UsersQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-question',
  templateUrl: 'users-question.html',
})
export class UsersQuestionPage {

  listQuestion: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.mAppModule.getHttpClient().getAngularHttp().request('assets/data/help.json').subscribe(data => {
      let dataObject = data.json();
      dataObject.list_question.forEach(question => {
        this.listQuestion.push(question);
      })
    })
  }

  onClickQuestion(content) {
    this.navCtrl.push("UsersQuestionDetailPage", { params: content });
  }

}
