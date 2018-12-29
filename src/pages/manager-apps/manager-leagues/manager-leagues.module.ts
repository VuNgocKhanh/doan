import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerLeaguesPage } from './manager-leagues';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManagerLeaguesPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerLeaguesPage),
    PipesModule
  ],
})
export class ManagerLeaguesPageModule {}
