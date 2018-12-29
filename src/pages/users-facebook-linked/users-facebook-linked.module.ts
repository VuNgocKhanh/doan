import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersFacebookLinkedPage } from './users-facebook-linked';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UsersFacebookLinkedPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersFacebookLinkedPage),
    ComponentsModule
  ],
})
export class UsersFacebookLinkedPageModule {}
