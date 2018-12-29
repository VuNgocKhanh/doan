import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeagueAdminToolPage } from './league-admin-tool';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    LeagueAdminToolPage,
  ],
  imports: [
    IonicPageModule.forChild(LeagueAdminToolPage),
    ComponentsModule,PipesModule
  ],
})
export class LeagueAdminToolPageModule {}
