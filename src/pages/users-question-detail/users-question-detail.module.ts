import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersQuestionDetailPage } from './users-question-detail';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UsersQuestionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersQuestionDetailPage),
    ComponentsModule
  ],
})
export class UsersQuestionDetailPageModule {}
