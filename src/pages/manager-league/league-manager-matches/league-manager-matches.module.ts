import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeagueManagerMatchesPage } from './league-manager-matches';

@NgModule({
  declarations: [
    LeagueManagerMatchesPage,
  ],
  imports: [
    IonicPageModule.forChild(LeagueManagerMatchesPage),
  ],
})
export class LeagueManagerMatchesPageModule {}
