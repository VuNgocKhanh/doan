import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerInfoInClubPage } from './player-info-in-club';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PlayerInfoInClubPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerInfoInClubPage),
    PipesModule
  ],
})
export class PlayerInfoInClubPageModule {}
