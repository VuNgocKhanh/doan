import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerAdminsClubDetailPage } from './manager-admins-club-detail';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManagerAdminsClubDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerAdminsClubDetailPage),
    PipesModule
  ],
})
export class ManagerAdminsClubDetailPageModule {}
