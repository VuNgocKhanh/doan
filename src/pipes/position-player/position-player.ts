import { Pipe, PipeTransform } from '@angular/core';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ConstantManager } from '../../providers/manager/constant-manager';

/**
 * Generated class for the PositionPlayerPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'positionPlayer',
})
export class PositionPlayerPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */

 
  transform(positoinID: number) {
    let playerPosition = ConstantManager.getInstance().getPlayerPositionByID(positoinID);
    if(playerPosition != null){
      return playerPosition.getName();
    }else{
      return "N/A";
    }
  }
}
