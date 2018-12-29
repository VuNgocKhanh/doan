import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePlayerPage } from './profile-player';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProfilePlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePlayerPage),
    PipesModule
  ],
})
export class ProfilePlayerPageModule {}
