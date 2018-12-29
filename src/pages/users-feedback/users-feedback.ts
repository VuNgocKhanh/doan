import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the UsersFeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-feedback',
  templateUrl: 'users-feedback.html',
})
export class UsersFeedbackPage {

  function: string = "";
  feedback: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public emailComposer: EmailComposer
  ) {
  }

  ionViewDidLoad() {
  }

  sendFeedback() {
    let email = {
      to: 'a3fiend@gmail.com',
      cc: '',
      bcc: '',
      subject: this.function,
      body: this.feedback
    }
    this.emailComposer.isAvailable().then((state: boolean) => {
      if (state) {
        this.emailComposer.open(email);
      }
    })
  }
}
