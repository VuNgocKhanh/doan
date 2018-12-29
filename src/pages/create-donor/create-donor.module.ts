import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateDonorPage } from './create-donor';

@NgModule({
  declarations: [
    CreateDonorPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateDonorPage),
  ],
})
export class CreateDonorPageModule {}
