import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69ClubInleaguePage } from './bd69-club-inleague';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    Bd69ClubInleaguePage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69ClubInleaguePage),
    ComponentsModule
  ],
})
export class Bd69ClubInleaguePageModule {}
