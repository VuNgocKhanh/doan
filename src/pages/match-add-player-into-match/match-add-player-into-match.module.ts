import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchAddPlayerIntoMatchPage } from './match-add-player-into-match';

@NgModule({
  declarations: [
    MatchAddPlayerIntoMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchAddPlayerIntoMatchPage),
  ],
})
export class MatchAddPlayerIntoMatchPageModule {}
