import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerLeaguesDetailPage } from './manager-leagues-detail';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ManagerLeaguesDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerLeaguesDetailPage),
    ComponentsModule
  ],
})
export class ManagerLeaguesDetailPageModule {}
