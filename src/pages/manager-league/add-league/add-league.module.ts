import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLeaguePage } from './add-league';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    AddLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(AddLeaguePage),
    ComponentsModule,
    PipesModule
  ],
})
export class AddLeaguePageModule {}
