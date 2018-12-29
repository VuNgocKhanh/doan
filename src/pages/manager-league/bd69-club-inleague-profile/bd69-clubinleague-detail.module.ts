import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69ClubinleagueDetailPage } from './bd69-clubinleague-detail';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    Bd69ClubinleagueDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69ClubinleagueDetailPage),
    ComponentsModule,
    PipesModule
  ],
})
export class Bd69ClubinleagueDetailPageModule {}
