import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewClubDetailPage } from './view-club-detail';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ViewClubDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewClubDetailPage),
    ComponentsModule
  ],
})
export class ViewClubDetailPageModule {}
