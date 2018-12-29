import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeagueManagerPage } from './league-manager';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    LeagueManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(LeagueManagerPage),
    ComponentsModule,
    PipesModule
  ],
})
export class LeagueManagerPageModule {}
