import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPlayerPage } from './list-player';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPlayerPage),
    ComponentsModule,
    PipesModule
  ],
})
export class ListPlayerPageModule {}
