import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchInfoPage } from './match-info';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MatchInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchInfoPage),
    ComponentsModule,
    PipesModule
  ],
})
export class MatchInfoPageModule {}
