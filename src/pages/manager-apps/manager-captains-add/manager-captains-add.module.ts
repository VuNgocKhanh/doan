import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerCaptainsAddPage } from './manager-captains-add';

@NgModule({
  declarations: [
    ManagerCaptainsAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerCaptainsAddPage),
  ],
})
export class ManagerCaptainsAddPageModule {}
