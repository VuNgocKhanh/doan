import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StadiumDetailPage } from './stadium-detail';

@NgModule({
  declarations: [
    StadiumDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(StadiumDetailPage),
  ],
})
export class StadiumDetailPageModule {}
