import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69ManagerMatchesPage } from './bd69-manager-matches';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    Bd69ManagerMatchesPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69ManagerMatchesPage),
    ComponentsModule
  ],
})
export class Bd69ManagerMatchesPageModule {}
