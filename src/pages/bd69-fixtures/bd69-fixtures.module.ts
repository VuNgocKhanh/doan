import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69FixturesPage } from './bd69-fixtures';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    Bd69FixturesPage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69FixturesPage),
    ComponentsModule

  ],
})
export class Bd69FixturesPageModule {}
