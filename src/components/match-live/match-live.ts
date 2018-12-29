import { Component,Input } from '@angular/core';
import { Match } from '../../providers/classes/matches';

/**
 * Generated class for the MatchLiveComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'match-live',
  templateUrl: 'match-live.html'
})
export class MatchLiveComponent {

  @Input("match") mMatch: Match;

  mDate: Date = new Date();
  
  constructor() {
  }

}
