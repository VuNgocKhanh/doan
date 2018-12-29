import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69ProfileLeaguePage } from './bd69-profile-league';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    Bd69ProfileLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69ProfileLeaguePage),
    ComponentsModule
  ],
})
export class Bd69ProfileLeaguePageModule {}
