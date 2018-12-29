import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectTimePage } from './select-time';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SelectTimePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectTimePage),
    ComponentsModule
  ],
})
export class SelectTimePageModule {}
