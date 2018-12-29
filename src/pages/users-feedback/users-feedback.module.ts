import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersFeedbackPage } from './users-feedback';
import { ComponentsModule } from '../../components/components.module';

import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    UsersFeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersFeedbackPage),
    ComponentsModule
  ],
  providers: [
    EmailComposer
  ]
})
export class UsersFeedbackPageModule { }
