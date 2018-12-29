import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevelopPage } from './develop';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DevelopPage,
  ],
  imports: [
    IonicPageModule.forChild(DevelopPage),
    ComponentsModule
  ],
})
export class DevelopPageModule {}
