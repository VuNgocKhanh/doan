import { Component, Input } from '@angular/core';
import { RoleInClub, ConstantManager } from '../../providers/manager/constant-manager';
import { Player } from '../../providers/classes/player';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the ListMemberComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-member',
  templateUrl: 'list-member.html'
})
export class ListMemberComponent {
  @Input("role") role: number = RoleInClub.GUEST;
  @Input("clubID") clubID: number = -1;
  @Input("mListPlayer") mListPlayer: Array<Player> = [];

  text: string;

  constructor(
    private navCtrl: NavController,
    private mAppModule: AppModuleProvider
  ) {
    this.text = 'Hello World';

  }


  ngAfterViewInit() {
    
  }



  onClickPlayer(player: Player) { 
    if (this.role < RoleInClub.CAPTAIN) {
      this.goToInfoPlayer(player);
    } else {
      if (player.getRoleInClub() == RoleInClub.MEMBER && this.role == RoleInClub.CAPTAIN) {
        this.mAppModule.showActionSheet("Thông tin thành viên", ConstantManager.getInstance().getOptionForManagerAndMemberInClub(), (res) => {
          this.onExtensionRespone(res, player);
        });
      } else if (player.getRoleInClub() == RoleInClub.MEMBER && this.role == RoleInClub.MANAGER) {
        this.mAppModule.showActionSheet("Thông tin thành viên", ConstantManager.getInstance().getOptionForAdminAndMemberInClub(), (res) => {
          this.onExtensionRespone(res, player);
        });
      } else if (player.getRoleInClub() == RoleInClub.CAPTAIN && this.role == RoleInClub.MANAGER) {
        this.mAppModule.showActionSheet("Thông tin thành viên", ConstantManager.getInstance().getOptionForAdminAndManagerInClub(), (res) => {
          this.onExtensionRespone(res, player);
        });
      } else {
        this.goToInfoPlayer(player);
      }
    }

  }

  onExtensionRespone(res, player) {
    if (res == 0) {
      this.goToInfoPlayer(player);
    } else if (res == 1) {
      this.onSetManager(this.clubID, player.playerID, RoleInClub.CAPTAIN);
    } else if (res == 2) {
      this.onSetManager(this.clubID, player.playerID, RoleInClub.MEMBER);
    } else if (res == 3) {
      this.onKickMember(this.clubID, player.playerID);
    }
  }

  onSetManager(clubID: number, playerID: number, roleInClub: number) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getClubManager().sendRequestChangeRole(clubID, playerID, roleInClub);
    });
  }

  onKickMember(clubID: number, playerID: number) {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getClubManager().sendRequestKickPlayer(clubID, playerID);
    });
  }

  goToInfoPlayer(player: Player) {
    this.navCtrl.push("PlayerInfoPage", { params: { playerId: player.getPlayerID(), clubId: this.clubID, role: this.role, type: 0 } });
  }
}
