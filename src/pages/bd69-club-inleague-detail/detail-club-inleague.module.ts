import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailClubInleaguePage } from './detail-club-inleague';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DetailClubInleaguePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailClubInleaguePage),
    ComponentsModule
  ],
})
export class DetailClubInleaguePageModule {}
