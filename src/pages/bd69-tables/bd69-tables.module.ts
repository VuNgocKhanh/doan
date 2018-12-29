import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69TablesPage } from './bd69-tables';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    Bd69TablesPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69TablesPage),
    ComponentsModule
  ],
})
export class Bd69TablesPageModule {}
