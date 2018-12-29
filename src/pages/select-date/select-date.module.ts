import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectDatePage } from './select-date';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SelectDatePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectDatePage),
    ComponentsModule
  ],
})
export class SelectDatePageModule {}
