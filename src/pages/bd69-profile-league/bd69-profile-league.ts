import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../providers/classes/league';
import { Rule } from '../../providers/classes/rule';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { UploadType } from '../../providers/manager/constant-manager';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { normalizeURL } from "ionic-angular";
import { CalendarDate } from '../../providers/core/calendar/calendar-date';

/**
 * Generated class for the Bd69ProfileLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-profile-league',
  templateUrl: 'bd69-profile-league.html',
})
export class Bd69ProfileLeaguePage {

  mLeague: Leagues = new Leagues();

  constructor(
    private mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeague = this.navParams.get("params");
    }
  }

  ionViewDidLoad() {

    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }
    this.mAppModule.addBd69SFSResponeListener("Bd69ProfileLeaguePage", respone => {
      this.onExtendsionRespone(respone);
    })

    this.mAppModule.getLeagueManager().sendRequestGetLeagueRule(this.mLeague.getLeagueID());
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69ProfileLeaguePage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_LEAGUE_INFO) {
      this.onResponeLeagueUpdateInfo(params);
    }
  }

  onUpdateSucess() {
    this.mAppModule.showToast("Cập nhật dữ liệu thành công");
    this.navCtrl.pop();
  }

  onResponeLeagueUpdateInfo(params) {
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mLeague.fromSFSobject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
      this.mAppModule.showToast("Cập nhật thành công");
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  getTimeStart(date: CalendarDate) {
    let timeend = this.mLeague.getTimeEndDate();
    if (date.yy < timeend.yy || (date.mm < timeend.mm && date.yy <= timeend.yy) || timeend.dd == -1 || (date.dd < timeend.dd && date.mm <= timeend.mm && date.yy <= timeend.yy)) {
      let timestart = new Date(date.yy + "-" + ((date.mm + 1) < 10 ? "0" : "") + (date.mm + 1) + "-" + (date.dd < 10 ? "0" : "") + date.dd);
      this.mLeague.setTimeStart(timestart.getTime());
    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày bắt đầu nhỏ hơn ngày kết thúc");
    }

  }
  getTimeEnd(date: CalendarDate) {
    let timeStart = this.mLeague.getTimeStartDate();

    if (date.yy > timeStart.yy || (date.mm > timeStart.mm && date.yy >= timeStart.yy) || timeStart.dd == -1 || (date.dd > timeStart.dd && date.mm >= timeStart.mm && date.yy >= timeStart.yy)) {
      let timeend = new Date(date.yy + "-" + ((date.mm + 1) < 10 ? "0" : "") + (date.mm + 1) + "-" + (date.dd < 10 ? "0" : "") + date.dd);
      this.mLeague.setTimeEnd(timeend.getTime());

    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày kết thúc lơn hơn ngày bắt đầu");
    }

  }

  onClickSave() {
    this.mAppModule.showLoading().then(() => {
      this.mAppModule.getLeagueManager().sendRequestLEAGUE_UPDATE_LEAGUE_INFO(this.mLeague.getLeagueID(), this.mLeague);
    })
  }

  onClickAvatar() {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mLeague.getLogo(), type: UploadType.COVER } }, (url) => {
      if (url) {
        this.mLeague.setLogo(url);
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_UPDATE_LEAGUE_LOGO(this.mLeague.getLeagueID(), url);
          this.getNormalizeAvatar();
        });
      }
    });

  }

  onClickCover() {
    this.mAppModule.showModalIonic("Bd69UploadImagePage", { params: { image: this.mLeague.getCover(), type: UploadType.COVER } }, (url) => {
      if (url) {
        this.mLeague.setCover(url);
        this.mAppModule.showLoading().then(() => {
          this.mAppModule.getLeagueManager().sendRequestLEAGUE_UPDATE_LEAGUE_COVER(this.mLeague.getLeagueID(), url);
          this.getNormalizeCover();
        });
      }
    });
  }

  getNormalizeAvatar() {
    return this.mAppModule.getLogo(normalizeURL(this.mLeague.getLogo()));
  }
  getNormalizeCover() {
    return this.mAppModule.getCover(normalizeURL(this.mLeague.getCover()));
  }
} 
