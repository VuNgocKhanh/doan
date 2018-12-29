import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TypeLeaguePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'typeLeague',
})
export class TypeLeaguePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ) {
    if (value == 0) {
      return "Phủi";
    } else if (value == 1) {
      return "Cup";
    } else if (value == 2) {
      return "League";
    } else {
      return "N/A";
    }
  }
}
