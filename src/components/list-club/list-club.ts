import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Clubs } from '../../providers/classes/clubs';

/**
 * Generated class for the ListClubComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-club',
  templateUrl: 'list-club.html'
})
export class ListClubComponent {
  @Input("clubs") mClubs: Array<Clubs> = [];
  @Output("clickClub") clickClub = new EventEmitter();

  text: string;

  constructor() {
    
  }

  goClubsDetail(club){
    this.clickClub.emit(club)
  }
}
