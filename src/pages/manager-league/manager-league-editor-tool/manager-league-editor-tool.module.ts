import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerLeagueEditorToolPage } from './manager-league-editor-tool';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ManagerLeagueEditorToolPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerLeagueEditorToolPage),
    ComponentsModule,
    PipesModule
  ],
})
export class ManagerLeagueEditorToolPageModule {}
