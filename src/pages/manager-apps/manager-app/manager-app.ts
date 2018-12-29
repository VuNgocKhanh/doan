import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConstantManager } from '../../../providers/manager/constant-manager';
import { User } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';

/**
 * Generated class for the ManagerAppPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-app',
  templateUrl: 'manager-app.html',
})
export class ManagerAppPage {

  items : Array<{id: number, name: string, icon: string}> = [];

  mUser: User;

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.mUser = this.mAppModule.getUserManager().getUser();
  }

  

  goToUserProfile(){
    this.navCtrl.setRoot("TabsPage");
  }

  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.onLoadItemsms();
  } 

  onLoadItemsms(){
    this.items = ConstantManager.getInstance().getListManagerAppsItems();
  }

  onClickItem(item){
    if(item.page){
      this.navCtrl.push(item.page);
    }
  }
}
