import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69AddRefereeIntoMatchPage } from './bd69-add-referee-into-match';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    Bd69AddRefereeIntoMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69AddRefereeIntoMatchPage),
    PipesModule
  ],
})
export class Bd69AddRefereeIntoMatchPageModule {}
