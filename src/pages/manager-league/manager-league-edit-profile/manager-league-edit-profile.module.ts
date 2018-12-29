import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerLeagueEditProfilePage } from './manager-league-edit-profile';

@NgModule({
  declarations: [
    ManagerLeagueEditProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerLeagueEditProfilePage),
  ],
})
export class ManagerLeagueEditProfilePageModule {}
