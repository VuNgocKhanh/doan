import { Pipe, PipeTransform } from '@angular/core';
import { LeagueState } from '../../providers/manager/constant-manager';

/**
 * Generated class for the StateLeaguePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'stateLeague',
})
export class StateLeaguePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(state: number) {
    if(state == LeagueState.INCOMING){
      return "Sắp diễn ra";
    }
    else if(state == LeagueState.BEGAN){
      return "Đang diễn ra";
    }
    else if(state == LeagueState.STOP){
      return "Đã kết thúc";
    }
    else if(state == LeagueState.CANCEL){
      return "Đã huỷ";
    } 
    else {
      return "N/A"
    }
  }
}
