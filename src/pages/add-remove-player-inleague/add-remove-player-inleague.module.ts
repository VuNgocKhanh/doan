import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRemovePlayerInleaguePage } from './add-remove-player-inleague';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddRemovePlayerInleaguePage,
  ],
  imports: [
    IonicPageModule.forChild(AddRemovePlayerInleaguePage),
    ComponentsModule
  ],
})
export class AddRemovePlayerInleaguePageModule {}
