import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberCardPage } from './member-card';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MemberCardPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberCardPage),
    ComponentsModule
  ],
})
export class MemberCardPageModule {}
