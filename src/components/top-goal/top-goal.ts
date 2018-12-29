import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TopGoalInLeague } from '../../providers/classes/top-goal-in-league';

/**
 * Generated class for the TopGoalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'top-goal',
  templateUrl: 'top-goal.html'
})
export class TopGoalComponent {
  @Input("goalList") mGoalList: TopGoalInLeague;
  @Output("clickPlayer") onClickPlayerInfo = new EventEmitter();
  constructor() {
  }

  emitEvent(data: any){
    this.onClickPlayerInfo.emit(data);
  }

}
