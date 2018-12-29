import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerAdminLeagueListPage } from './manager-admin-league-list';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManagerAdminLeagueListPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerAdminLeagueListPage),
    PipesModule
  ],
})
export class ManagerAdminLeagueListPageModule {}
