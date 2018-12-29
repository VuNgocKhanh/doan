import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopGoalInLeaguePage } from './top-goal-in-league';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TopGoalInLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(TopGoalInLeaguePage),
    ComponentsModule
  ],
})
export class TopGoalInLeaguePageModule {}
