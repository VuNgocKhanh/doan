import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Bd69RuleOfLeaguePage } from './bd69-rule-of-league';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    Bd69RuleOfLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(Bd69RuleOfLeaguePage),
    ComponentsModule
  ],
})
export class Bd69RuleOfLeaguePageModule {}
