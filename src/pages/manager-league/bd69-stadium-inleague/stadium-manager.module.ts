import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StadiumManagerPage } from './stadium-manager';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    StadiumManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(StadiumManagerPage),
    ComponentsModule
  ],
})
export class StadiumManagerPageModule {}
