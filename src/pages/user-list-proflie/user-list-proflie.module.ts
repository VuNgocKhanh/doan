import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserListProfliePage } from './user-list-proflie';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UserListProfliePage,
  ],
  imports: [
    IonicPageModule.forChild(UserListProfliePage),
    ComponentsModule
  ],
})
export class UserListProfliePageModule {}
