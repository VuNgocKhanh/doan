import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersQuestionPage } from './users-question';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UsersQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersQuestionPage),
    ComponentsModule
  ],
})
export class UsersQuestionPageModule {}
