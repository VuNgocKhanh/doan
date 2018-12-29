import { Pipe, PipeTransform } from '@angular/core';
import { ConstantManager } from '../../providers/manager/constant-manager';

/**
 * Generated class for the EventColorPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'eventColor',
})
export class EventColorPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(type: number) {
    return ConstantManager.getInstance().getListMatchEventType()[type].color;
  }
}
