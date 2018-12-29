import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ScrollItems, ScrollController, ScrollOption } from '../../providers/core/common/scroll-controller';

/**
 * Generated class for the TimeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'time',
  templateUrl: 'time.html'
})
export class TimeComponent {
  @Input("centerIndexs") mCenterIndexs: Array<number> = [];
  @Output("onChange") mEventEmitter = new EventEmitter();
  text: string;

  constructor() {
    this.text = 'Hello World';
    this.onLoadTime();
  }

  mMinutes: Array<number> = [];
  mHours: Array<number> = [];
  divIDs: Array<string> = ["hourID", "minuteID"];
  mCreateEvent: boolean = false;

  mScrollController: ScrollController = new ScrollController();
  mScrollItems: Array<ScrollItems> = [];
  onCreateEvent() {
    if (this.mCreateEvent) {
      this.scrollToSelect();
      return;
    }
    this.mCreateEvent = true;
    for (let i = 0; i < this.divIDs.length; i++) {
      let newScrollItems = new ScrollItems(this.divIDs[i]);
      this.mScrollItems.push(newScrollItems);
      newScrollItems.createListener();
      newScrollItems.setCenterChangedListend((data) => {
        this.mCenterIndexs[i] = data[0];
      });
      newScrollItems.setScrollEndListener((res) => {
        let top = this.mCenterIndexs[i] * newScrollItems.mItemHeight;
        let option: ScrollOption = {
          alpha: 0.2,
          epsilon: 1,
          callback: () => {
            this.mEventEmitter.emit(this.mCenterIndexs);
          }
        }
        this.scrollTop(this.divIDs[i], top, option);
      })
    }
    this.scrollToSelect();
  }

  scrollToSelect() {
    for (let i = 0; i < this.mCenterIndexs.length; i++) {
      let top = this.mScrollItems[i].mItemHeight * this.mCenterIndexs[i];
      this.mScrollItems[i].mElement.scrollTop = top;
      
    }
  }

  ngAfterViewInit() {
    this.onCreateEvent();
  }

  scrollTop(divIDs: string, top: number, option?: any) {
    this.mScrollController.doScroll(divIDs, top, option ? option : null);
  }
  onLoadTime() {
    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        this.mHours.push(i);
      }
      this.mMinutes.push(i);
    }
  }
}
