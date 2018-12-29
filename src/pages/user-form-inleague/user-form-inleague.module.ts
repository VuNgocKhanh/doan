import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserFormInleaguePage } from './user-form-inleague';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UserFormInleaguePage,
  ],
  imports: [
    IonicPageModule.forChild(UserFormInleaguePage),
    ComponentsModule
  ],
})
export class UserFormInleaguePageModule {}
