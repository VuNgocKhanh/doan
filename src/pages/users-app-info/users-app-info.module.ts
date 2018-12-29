import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersAppInfoPage } from './users-app-info';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UsersAppInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersAppInfoPage),
    ComponentsModule
  ],
})
export class UsersAppInfoPageModule {}
