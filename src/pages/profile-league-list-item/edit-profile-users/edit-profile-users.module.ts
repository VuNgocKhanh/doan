import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfileUsersPage } from './edit-profile-users';

@NgModule({
  declarations: [
    EditProfileUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(EditProfileUsersPage),
  ],
})
export class EditProfileUsersPageModule {}
