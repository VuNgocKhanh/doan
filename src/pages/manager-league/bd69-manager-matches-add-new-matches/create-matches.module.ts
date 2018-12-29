import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMatchesPage } from './create-matches';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    CreateMatchesPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMatchesPage),
    ComponentsModule,
    PipesModule
  ],
})
export class CreateMatchesPageModule {}
