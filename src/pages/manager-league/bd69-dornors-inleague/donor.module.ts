import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DonorPage } from './donor';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    DonorPage,
  ],
  imports: [
    IonicPageModule.forChild(DonorPage),
    // ComponentsModule
  ],
})
export class DonorPageModule {}
