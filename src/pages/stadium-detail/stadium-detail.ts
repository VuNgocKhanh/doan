import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Dornor } from '../../providers/classes/donnor';
import { Stadium } from '../../providers/classes/stadium';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';



@IonicPage()
@Component({
  selector: 'page-stadium-detail',
  templateUrl: 'stadium-detail.html',
})
export class StadiumDetailPage {


  mStadium: Stadium = new Stadium();

  mapLink: string = "";

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  ionViewDidLoad() {

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("StadiumDetailPage", respone => {
        this.onExtensionRespone(respone);
      })

      this.mAppModule.getLeagueManager().sendRequestGetStadiumInfo(this.mStadium.getStadiumID());

    })
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_STADIUM_INFO) {
      this.onResponeGetStadiumInfo(params);
    }
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("StadiumDetailPage");
  }

  onResponeGetStadiumInfo(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mStadium.fromSFSobject(content.getSFSObject(ParamsKey.INFO));

          this.mapLink = "https://www.google.com/maps/search/" + this.mStadium.getName();
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onLoadParams() {
    if (this.navParams.data["stadiumID"]) {
      this.mStadium.setStadiumID(this.navParams.get("stadiumID"));
    }
  }

  onCall(phoneNumber) {
    let a = document.createElement("a");
    a.href = "tel:" + phoneNumber;
    document.body.appendChild(a);
    a.click();
  }

  onClickShowMap() {
    let a = document.createElement("a");
    a.href = this.mapLink;
    document.body.appendChild(a);
    a.click();
  }


}
