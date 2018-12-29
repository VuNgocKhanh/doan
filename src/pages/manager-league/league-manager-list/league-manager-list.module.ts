import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeagueManagerListPage } from './league-manager-list';

@NgModule({
  declarations: [
    LeagueManagerListPage,
  ],
  imports: [
    IonicPageModule.forChild(LeagueManagerListPage),
  ],
})
export class LeagueManagerListPageModule {}
