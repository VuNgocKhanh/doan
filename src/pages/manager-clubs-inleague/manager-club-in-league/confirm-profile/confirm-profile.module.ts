import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmProfilePage } from './confirm-profile';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    ConfirmProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmProfilePage),
    ComponentsModule
  ],
})
export class ConfirmProfilePageModule {}
