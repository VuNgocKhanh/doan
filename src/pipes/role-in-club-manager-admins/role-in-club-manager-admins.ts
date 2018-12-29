import { Pipe, PipeTransform } from '@angular/core';
import { ConstantManager } from '../../providers/manager/constant-manager';

/**
 * Generated class for the RoleInClubManagerAdminsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'roleInClubManagerAdmins',
})
export class RoleInClubManagerAdminsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(id: number) {
    let result = "";
    let roles = ConstantManager.getInstance().getRoleOfUserInClubFormManagerAdmin();
    for(let i = 0 ;i < roles.length; i++){
      if(roles[i].id == id){
        result = roles[i].name;
        break;
      }
    }
    return result;
  }
}
