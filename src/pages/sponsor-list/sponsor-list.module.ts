import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SponsorListPage } from './sponsor-list';

@NgModule({
  declarations: [
    SponsorListPage,
  ],
  imports: [
    IonicPageModule.forChild(SponsorListPage),
  ],
})
export class SponsorListPageModule {}
