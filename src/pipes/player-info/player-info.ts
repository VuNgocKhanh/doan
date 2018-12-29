import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PlayerInfoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'playerInfo',
})
export class PlayerInfoPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    let result = "N/A";
    
    if(value == "" || value == undefined || value == null || parseInt(value) < 1 || value == "01/01/1970" || parseInt(value) <= 0){
      return result
    } else if(value != ""){
      return value;
    }
  }
}
