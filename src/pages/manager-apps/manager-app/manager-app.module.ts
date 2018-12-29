import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerAppPage } from './manager-app';

@NgModule({
  declarations: [
    ManagerAppPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerAppPage),
  ],
})
export class ManagerAppPageModule {}
