import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69AddClubPage } from './bd69-add-club';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    Bd69AddClubPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69AddClubPage),
    ComponentsModule
  ],
})
export class Bd69AddClubPageModule {}
