import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerLeagueRecordMatchPage } from './manager-league-record-match';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManagerLeagueRecordMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerLeagueRecordMatchPage),
    PipesModule
  ],
})
export class ManagerLeagueRecordMatchPageModule {}
