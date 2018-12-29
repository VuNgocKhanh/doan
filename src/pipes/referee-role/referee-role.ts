import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RefereeRolePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'refereeRole',
})
export class RefereeRolePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(role: number): string {
    if(role == 1){
      return "Trọng tài chính";
    }
    else if(role == 2){
      return "Trọng tài biên";
    }
    else if(role == 3){
      return "Giám sát";
    }
    return "N/A";
  }
}
