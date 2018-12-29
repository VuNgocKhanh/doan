import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmMatchPage } from './confirm-match';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    ConfirmMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmMatchPage),
    ComponentsModule
  ],
})
export class ConfirmMatchPageModule {}
