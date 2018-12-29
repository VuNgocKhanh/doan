import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69ClubInleagueUpdatePage } from './bd69-club-inleague-update';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    Bd69ClubInleagueUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69ClubInleagueUpdatePage),
    ComponentsModule,
    PipesModule
  ],
})
export class Bd69ClubInleagueUpdatePageModule {}
