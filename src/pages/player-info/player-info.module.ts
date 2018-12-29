import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerInfoPage } from './player-info';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PlayerInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerInfoPage),
    ComponentsModule,
    PipesModule
  ],
})
export class PlayerInfoPageModule {}
