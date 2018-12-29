import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';
import { CalendarMonth } from '../../providers/core/calendar/calendar-month';
import { ScrollController, ScrollItems, ScrollOption } from '../../providers/core/common/scroll-controller';
import { CalendarUtils } from '../../providers/core/calendar/calendar-utils';

/**
 * Generated class for the CalendarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {
  @Output("selectDate") mEventEmitter = new EventEmitter();
  @Input("selected") dateSelected: CalendarDate;


  dates: Array<number> = [];

  months: Array<number> = [];

  years: Array<number> = [];

  mCenterIndexs: Array<number> = [0, 0, 0];

  divIDs: Array<string> = ["dateID", "monthID", "yearID"];

  mCreateEvent: boolean = false;

  mScrollController: ScrollController = new ScrollController();

  mScrollItems: Array<ScrollItems> = [];

  today: Date = new Date();

  constructor() {
    this.onLoadDates(this.today.getMonth(), this.today.getFullYear());
    this.onLoadMonths();
    this.onLoadYears();
  }

  ngAfterViewInit() {
    this.onCreateEvent();
  }

  onLoadDates(month: number, year: number) {
    let maxDate = CalendarUtils._TinhSoNgayTrongThang(month, year);
    this.dates = [];
    for (let i = 1; i <= maxDate; i++) {
      this.dates.push(i);
    }
  }

  onLoadMonths() {
    this.months = [];
    for (let i = 1; i <= 12; i++) {
      this.months.push(i);
    }
  }

  onLoadYears() {
    this.years = [];
    for (let i = 1900; i <= 2050; i++) {
      this.years.push(i);
    }
  }

  onCreateEvent() {
    if (this.mCreateEvent) {
      return;
    }
    this.mCreateEvent = true;
    for (let i = 0; i < this.divIDs.length; i++) {
      let newScrollItems = new ScrollItems(this.divIDs[i]);
      this.mScrollItems.push(newScrollItems);
      newScrollItems.createListener();
      newScrollItems.setCenterChangedListend((data) => {
        this.mCenterIndexs[i] = data[0];
        if (i > 0) {
          this.onLoadDates(this.mCenterIndexs[1], this.mCenterIndexs[2]);
          let focusIndex = this.mScrollItems[0].getCurrentFocusElement(false);
          this.mCenterIndexs[0] = focusIndex;
        }
      });
      newScrollItems.setScrollEndListener((res) => {
        let focusIndex = newScrollItems.getElementInFocus(res[0]);
        this.mCenterIndexs[i] = focusIndex;
        let top = newScrollItems.getScrollOfItemIndex(this.mCenterIndexs[i]);
        this.scrollTop(this.divIDs[i], top);
      })
      newScrollItems.isScrollingByTouch()
    }
    this.scrollToday();
  }

  getCenterIndex(type: number, value: number) {
    let data = [];
    if (type == 0) {
      data = this.dates;
    } else if (type == 1) {
      data = this.months;
    } else {
      data = this.years;
    }
    return data.findIndex(ele => {
      return ele == value;
    })
  }

  scrollToday() {
    
    if (this.dateSelected.dd == -1 || this.dateSelected.mm == -1 || this.dateSelected.yy == -1) {
      this.mCenterIndexs[0] = this.getCenterIndex(0, this.today.getDate());
      this.mCenterIndexs[1] = this.getCenterIndex(1, this.today.getMonth() + 1);
      this.mCenterIndexs[2] = this.getCenterIndex(2, this.today.getFullYear());
    } else {
      this.mCenterIndexs[0] = this.getCenterIndex(0, this.dateSelected.dd);
      this.mCenterIndexs[1] = this.getCenterIndex(1, this.dateSelected.mm + 1);
      this.mCenterIndexs[2] = this.getCenterIndex(2, this.dateSelected.yy);
    }
    for (let i = 0; i < this.mCenterIndexs.length; i++) {
      let top = this.mScrollItems[i].getScrollOfItemIndex(this.mCenterIndexs[i]);
      this.mScrollItems[i].mElement.scrollTop = top;
    }
  }

  scrollTop(divId: string, top: number) {
    let option: ScrollOption = {
      alpha: 0.2,
      epsilon: 1,
      callback: () => {
        let i = this.divIDs.findIndex(ele=>{
          return ele == divId;
        })
        if (i > 0) {
          this.onLoadDates(this.mCenterIndexs[1], this.mCenterIndexs[2]);
          this.mCenterIndexs[0] = this.mScrollItems[0].getCurrentFocusElement(true);
        }
      }
    }
    this.mScrollController.doScroll(divId, top, option ? option : null);
  }

  onClickSave() {
    this.dateSelected.dd = this.dates[this.mCenterIndexs[0]];
    this.dateSelected.mm = this.months[this.mCenterIndexs[1]] -1;
    this.dateSelected.yy = this.years[this.mCenterIndexs[2]];
    this.mEventEmitter.emit(this.dateSelected);
  }
}
