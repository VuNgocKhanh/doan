import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMemberIntoClubPage } from './add-member-into-club';

@NgModule({
  declarations: [
    AddMemberIntoClubPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMemberIntoClubPage),
  ],
})
export class AddMemberIntoClubPageModule {}
