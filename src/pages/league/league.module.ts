import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaguePage } from './league';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(LeaguePage),
    ComponentsModule,
    PipesModule
  ],
})
export class LeaguePageModule {}
