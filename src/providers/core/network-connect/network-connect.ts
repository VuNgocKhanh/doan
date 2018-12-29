
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';
/*
  Generated class for the NetworkConnectProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.


  Install 
  $ ionic cordova plugin add cordova-plugin-network-information
  $ npm install --save @ionic-native/network
*/

export class NetworkConnectController {
  mNetwork: Network = null;
  constructor() {
  }

  public _setNetwork(network: Network): void {
    this.mNetwork = network;
  }

  disconnectSubscription: Subscription;
  public _onDisConnect(callback?: any): void {
    if (this.mNetwork) this.disconnectSubscription = this.mNetwork.onDisconnect().subscribe(() => {
      if (callback) {
        callback();
      }
    });
  }

  public _unSubcribeDisConnect(): void {
    if (this.disconnectSubscription) this.disconnectSubscription.unsubscribe();
  }


  connectSubscription: Subscription;
  public _onConnect(callback?: any): void {
    if (this.mNetwork) this.connectSubscription = this.mNetwork.onConnect().subscribe(() => {
      if (callback) {
        callback();
      }
    });
  }

  /**
   * _unSubcribeConnect
   */
  public _unSubcribeConnect(): void {
    if (this.connectSubscription) this.connectSubscription.unsubscribe();
  }
  /**
   * getTypeConnect
   */
  public getTypeConnect(): string {
    return this.mNetwork.type;
  }



}
