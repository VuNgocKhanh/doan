import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerUserPage } from './manager-user';

@NgModule({
  declarations: [
    ManagerUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerUserPage),
  ],
})
export class ManagerUserPageModule {}
