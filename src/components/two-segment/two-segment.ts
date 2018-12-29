import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the TwoSegmentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'two-segment',
  templateUrl: 'two-segment.html'
})
export class TwoSegmentComponent {

  @Input("menus") menus: Array<{id: number, name: string}> = [
    {id: 0, name: "Thành viên"},
    {id: 1, name: "Yêu cầu"}
  ];

  @Output("onSelect") mEventEmitter = new EventEmitter();
  IDSelected: number = 0;
  

  constructor() {
  }

  select(item){
    this.IDSelected = item.id;
    this.mEventEmitter.emit(this.IDSelected);
  }

}
