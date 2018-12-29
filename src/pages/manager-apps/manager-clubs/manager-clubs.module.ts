import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerClubsPage } from './manager-clubs';

@NgModule({
  declarations: [
    ManagerClubsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerClubsPage),
  ],
})
export class ManagerClubsPageModule {}
