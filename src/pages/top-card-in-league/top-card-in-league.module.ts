import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopCardInLeaguePage } from './top-card-in-league';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TopCardInLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(TopCardInLeaguePage),
    ComponentsModule
  ],
})
export class TopCardInLeaguePageModule {}
