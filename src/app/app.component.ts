import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AppModuleProvider } from '../providers/app-module/app-module';
import { APPKEYS } from '../providers/app-module/app-keys';

import { Network } from '@ionic-native/network';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = "LoadingPage";
  // rootPage: any = "ManagerAppPage";
  constructor(platform: Platform, private mAppModule: AppModuleProvider) {
    platform.ready().then(() => {
      this.onCreateEvent();
    });
  }

  onCreateEvent() {
    this.mAppModule.getNetworkController()._onConnect(() => {
      this.hideDisConnect();
    })

    this.mAppModule.getNetworkController()._onDisConnect(() => {
      this.showDisConnect();
    })
  }

  showDisConnect() {
    let ele = document.getElementById(APPKEYS.DISCONNECTID);
    let padding = document.getElementById(APPKEYS.PADDINGDISCONNECT);
    if (ele) {
      ele.style.display = "block";
    }
    if (padding) {
      padding.style.display = "block";
    }
  }
  hideDisConnect() {
    let ele = document.getElementById(APPKEYS.DISCONNECTID);
    let padding = document.getElementById(APPKEYS.PADDINGDISCONNECT);
    if (ele) {
      ele.style.display = "none";
    }
    if (padding) {
      padding.style.display = "none";
    }
    this.mAppModule.hideLoading();
  }
}
