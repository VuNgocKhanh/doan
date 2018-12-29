import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Rounds } from '../../providers/classes/rounds';
import { AppModuleProvider } from '../../providers/app-module/app-module';

/**
 * Generated class for the LeagueRoundComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'league-round',
  templateUrl: 'league-round.html'
})
export class LeagueRoundComponent {

  @Input("rounds") mRounds: Array<Rounds> = [];
  @Output("onSelectRound") mEventEmitter = new EventEmitter();
  @Output("onAddRound") mEventEmitter2 = new EventEmitter();

  constructor(public mAppModule: AppModuleProvider) {
  }

  onClickRound(round: Rounds,index: number){
    this.mEventEmitter.emit({round: round,index: index});
  }
  
  
}
