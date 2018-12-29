import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Match } from '../../providers/classes/matches';
import { RoleInLeague, ConstantManager } from '../../providers/manager/constant-manager';
import { CalendarUtils } from '../../providers/core/calendar/calendar-utils';

/**
 * Generated class for the MatchesResultComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
export interface Fixtures {
  date: Date;
  matches: Array<Match>;
}

export interface FixturesName{
  name: string;
  matches: Array<Match>;

}

@Component({
  selector: 'matches-result',
  templateUrl: 'matches-result.html'
})
export class MatchesResultComponent {

  @Output("onSelectMore") mEvent = new EventEmitter();
  @Input("fixture") mFixtures: Fixtures;
  @Input("role") mRoleOfUserInLeague: number = RoleInLeague.GUEST;

  @Input("mFixturesName") mFixturesName: FixturesName;


  constructor(private mAppModule: AppModuleProvider) {
  }

  ngAfterViewInit() {
    
  }



  onSelectMore(match: Match) {
    if (this.mRoleOfUserInLeague >= RoleInLeague.LEAGUEMANAGER) {
      this.showActionSheet(match);
    } else {
      this.mEvent.emit({ match: match, id: 0 });
    }
  }

  showActionSheet(match: Match) {
    this.mAppModule.showActionSheet("Trận đấu", ConstantManager.getInstance().getMatchActionSheet(), (res) => {
      if (res > -1) {
        this.mEvent.emit({ match: match, id: res });
      }
    })
  }

  getDayOfTheWeekName(day: number): string{
    return CalendarUtils.getDayOfTheWeekName(day);
  }
}
