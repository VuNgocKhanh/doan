import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ClubInLeague } from '../../providers/classes/clubinleague';
import { Group } from '../../providers/classes/group';
import { ConstantManager } from '../../providers/manager/constant-manager';
// import { resolveSoa } from 'dns';


/**
 * Generated class for the Bd69TableComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
export interface ListGroupModels{
  group: Group;
  clubs: Array<ClubInLeague>;
}

@Component({
  selector: 'bd69-table',
  templateUrl: 'bd69-table.html'
})
export class Bd69TableComponent {
  @Input('mTables') mTables: Array<ClubInLeague> = [];
  @Output("onSelectClub") mEventEmitter = new EventEmitter();

  constructor(private mAppModule: AppModuleProvider) {
  }


  ngAfterViewInit() {
  }


  onClickOnTable(club){
    this.mEventEmitter.emit(club);
  }

  
}
