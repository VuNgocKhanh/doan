import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerLeagueTablePage } from './manager-league-table';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ManagerLeagueTablePage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerLeagueTablePage),
    ComponentsModule
  ],
})
export class ManagerLeagueTablePageModule {}
