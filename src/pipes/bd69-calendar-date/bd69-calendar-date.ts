import { Pipe, PipeTransform } from '@angular/core';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';

/**
 * Generated class for the Bd69CalendarDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'bd69CalendarDate',
})
export class Bd69CalendarDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(calendar: CalendarDate) {
    let result = "Chọn ngày";
    if(calendar.dd > -1 && calendar.mm > -1 && calendar.yy > -1){
      return (calendar.dd < 10 ? "0" : "") + calendar.dd + "-" + ((calendar.mm + 1) < 10 ? "0" : "") + (calendar.mm + 1)+ "-" + calendar.yy;
    }
    return result;
  }
}
