import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PlayerCards } from '../../providers/classes/playercards';

/**
 * Generated class for the PlayerCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */


@Component({
  selector: 'player-card',
  templateUrl: 'player-card.html'
})
export class PlayerCardComponent {


  @Input("data") mDatas: PlayerCards;
  @Output("onClickCard") mEventEmitter = new EventEmitter();

  constructor() {
    
  }

}
