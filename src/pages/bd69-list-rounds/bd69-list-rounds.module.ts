import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69ListRoundsPage } from './bd69-list-rounds';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    Bd69ListRoundsPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69ListRoundsPage),
    ComponentsModule
  ],
})
export class Bd69ListRoundsPageModule {}
