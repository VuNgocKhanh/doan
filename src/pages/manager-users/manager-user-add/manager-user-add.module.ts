import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerUserAddPage } from './manager-user-add';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManagerUserAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerUserAddPage),
    PipesModule
  ],
})
export class ManagerUserAddPageModule {}
