import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';
import { CalendarUtils } from '../../providers/core/calendar/calendar-utils';
import { ScrollController, ScrollItems, ScrollOption } from '../../providers/core/common/scroll-controller';

/**
 * Generated class for the SelectDatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-date',
  templateUrl: 'select-date.html',
})
export class SelectDatePage {

  mCalendarDate: CalendarDate = new CalendarDate();

  constructor(
    public mViewController: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  
  ionViewDidLoad() {
  }



  getSelectedDate($event) {
    this.mCalendarDate = $event;
    this.closeView();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mCalendarDate = this.navParams.get("params");
    }
  }

  closeView() {
    this.mViewController.dismiss(this.mCalendarDate);
  }

  
}
