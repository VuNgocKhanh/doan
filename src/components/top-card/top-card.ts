import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TopCardInLeague } from '../../providers/classes/top-card-in-league';

/**
 * Generated class for the TopCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'top-card',
  templateUrl: 'top-card.html'
})
export class TopCardComponent {
  @Input("cardList") mCardList: TopCardInLeague;
  @Output("clickPlayer") onClickPlayerInfo = new EventEmitter();

  constructor() {
    
  }
  emitEvent(data: any){
    this.onClickPlayerInfo.emit(data);
  }
}
