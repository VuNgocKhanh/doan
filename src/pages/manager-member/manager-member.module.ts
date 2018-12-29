import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerMemberPage } from './manager-member';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManagerMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerMemberPage),
    ComponentsModule,
    PipesModule
  ],
})
export class ManagerMemberPageModule {}
