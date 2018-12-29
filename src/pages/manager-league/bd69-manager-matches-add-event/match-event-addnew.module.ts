import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchEventAddnewPage } from './match-event-addnew';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    MatchEventAddnewPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchEventAddnewPage),
    PipesModule
  ],
})
export class MatchEventAddnewPageModule {}
