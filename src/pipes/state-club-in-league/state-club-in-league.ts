import { Pipe, PipeTransform } from '@angular/core';
import { StateClubInLeague } from '../../providers/manager/constant-manager';

/**
 * Generated class for the StateClubInLeaguePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'stateClubInLeague',
})
export class StateClubInLeaguePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(state: number) {
    let res: string = "";
    switch (state) {
      case StateClubInLeague.JOINNED:
        res = "Chưa xác nhận";
        break;
      case StateClubInLeague.INVALID:
        res = "Không hợp lệ";
        break;
      case StateClubInLeague.VALIDATED:
        res = "Hợp lệ";
        break;
      default:
        res = "Chưa xác nhận";
        break;
    }
    return res;
  }
}
