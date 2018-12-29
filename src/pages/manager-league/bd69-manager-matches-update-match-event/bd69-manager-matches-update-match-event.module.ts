import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69ManagerMatchesUpdateMatchEventPage } from './bd69-manager-matches-update-match-event';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    Bd69ManagerMatchesUpdateMatchEventPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69ManagerMatchesUpdateMatchEventPage),
    PipesModule
  ],
})
export class Bd69ManagerMatchesUpdateMatchEventPageModule {}
