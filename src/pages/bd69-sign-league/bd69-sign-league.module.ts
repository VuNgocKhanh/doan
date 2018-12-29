import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69SignLeaguePage } from './bd69-sign-league';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    Bd69SignLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69SignLeaguePage),
    ComponentsModule
  ],
})
export class Bd69SignLeaguePageModule {}
