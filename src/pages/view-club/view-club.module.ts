import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewClubPage } from './view-club';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ViewClubPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewClubPage),
    ComponentsModule
  ],
})
export class ViewClubPageModule {}
