import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditClubPage } from './edit-club';

@NgModule({
  declarations: [
    EditClubPage,
  ],
  imports: [
    IonicPageModule.forChild(EditClubPage),
  ],
})
export class EditClubPageModule {}
