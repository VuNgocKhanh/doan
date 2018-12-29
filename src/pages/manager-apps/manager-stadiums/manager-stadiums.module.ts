import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerStadiumsPage } from './manager-stadiums';

@NgModule({
  declarations: [
    ManagerStadiumsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerStadiumsPage),
  ],
})
export class ManagerStadiumsPageModule {}
