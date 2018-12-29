import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchClubLeaguePage } from './search-club-league';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SearchClubLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchClubLeaguePage),
    ComponentsModule
  ],
})
export class SearchClubLeaguePageModule {}
