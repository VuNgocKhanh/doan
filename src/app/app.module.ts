import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Config } from 'ionic-angular';
import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { AppModuleProvider } from '../providers/app-module/app-module';
import { FadeInTransiton } from '../transitions/fade-in.transition';
import { FadeOutTransition } from '../transitions/fade-out.transition';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal'
import { NetworkInterface } from '@ionic-native/network-interface';
import { HTTP } from '@ionic-native/http';
import { Facebook } from '@ionic-native/facebook';
import { Stadium } from '../providers/classes/stadium';
import { Network } from '@ionic-native/network';
import { ModalScaleUpEnterTransition } from '../transitions/scale-up-enter.transition';
import { ModalScaleUpLeaveTransition } from '../transitions/scale-up-leave.transition';

import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera} from '@ionic-native/camera';
import { HttpClientModule } from '@angular/common/http';
import { EmailComposer } from '@ionic-native/email-composer';
import { ReplacePageTransition } from '../transitions/replace.transition';

@NgModule({
  declarations: [
    MyApp
    // AboutPage,
    // ContactPage,
    // HomePage,
    // TabsPage,
    // UsersPage,
    // LoginPage,
    // LoadingPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      scrollPadding : false,
      scrollAssists : false
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
    // AboutPage,
    // ContactPage,
    // HomePage,
    // TabsPage,
    // UsersPage,
    // LoginPage,
    // LoadingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppModuleProvider, NetworkInterface, OneSignal, Device, HTTP, Facebook, Stadium, Network,FileTransfer,Camera,EmailComposer
  ]
})
export class AppModule {
  constructor(public config: Config) {
    this.config.setTransition('fade-in', FadeInTransiton);
    this.config.setTransition('fade-out', FadeOutTransition);
    this.config.setTransition('scale-up', ModalScaleUpEnterTransition);
    this.config.setTransition('scale-down', ModalScaleUpLeaveTransition);
    this.config.setTransition('replace', ReplacePageTransition);
  }
}
