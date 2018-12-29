import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the StateRecordPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'stateRecord',
})
export class StateRecordPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if(value == 0){
      return "";
    }else{
      return true;
    }
  }
}
