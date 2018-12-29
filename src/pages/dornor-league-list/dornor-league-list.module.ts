import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DornorLeagueListPage } from './dornor-league-list';

@NgModule({
  declarations: [
    DornorLeagueListPage,
  ],
  imports: [
    IonicPageModule.forChild(DornorLeagueListPage),
  ],
})
export class DornorLeagueListPageModule {}
