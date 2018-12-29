import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeagueDetailPage } from './league-detail';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LeagueDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LeagueDetailPage),
    ComponentsModule,
    PipesModule
  ],
})
export class LeagueDetailPageModule {}
