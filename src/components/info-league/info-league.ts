import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Leagues } from '../../providers/classes/league';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ConstantManager, UploadType } from '../../providers/manager/constant-manager';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { normalizeURL } from "ionic-angular";
/**
 * Generated class for the InfoLeagueComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'info-league',
  templateUrl: 'info-league.html'
})
export class InfoLeagueComponent {
  @Input("league") newLeague: Leagues = new Leagues();
  @Output("onChangeAvatar") changeLogo = new EventEmitter();
  @Output("onChangeCover") changeCover = new EventEmitter();


  inPutNumberClub: number = 0;

  avatar: string = "";
  cover: string = "";

  avatarFileName: string = "";
  coverFileName: string = "";

  selectedFile: any;

  constructor(private mAppModule: AppModuleProvider) {
  }

  ngAfterViewInit() {
    this.avatar = this.newLeague.getLogo();
    this.cover = this.newLeague.getCover();
  }

  inputNumber() {
    this.newLeague.setNumberClub(parseInt(this.newLeague.getNumberClub() + ""));
  }

  getTimeStart(date: CalendarDate) {
    let timeend = this.newLeague.getTimeEndDate();
    if (date.yy < timeend.yy || (date.mm < timeend.mm && date.yy <= timeend.yy) || timeend.dd == -1 || (date.dd < timeend.dd && date.mm <= timeend.mm && date.yy <= timeend.yy)) {
      let timestart = new Date(date.yy + "-" + ((date.mm + 1) < 10 ? "0" : "") + (date.mm + 1) + "-" + (date.dd < 10 ? "0" : "") + date.dd);
      this.newLeague.setTimeStart(timestart.getTime());
    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày bắt đầu nhỏ hơn ngày kết thúc");
    }

  }
  getTimeEnd(date: CalendarDate) {
    let timeStart = this.newLeague.getTimeStartDate();

    if (date.yy > timeStart.yy || (date.mm > timeStart.mm && date.yy >= timeStart.yy) || timeStart.dd == -1 || (date.dd > timeStart.dd && date.mm >= timeStart.mm && date.yy >= timeStart.yy)) {
      let timeend = new Date(date.yy + "-" + ((date.mm + 1) < 10 ? "0" : "") + (date.mm + 1) + "-" + (date.dd < 10 ? "0" : "") + date.dd);
      this.newLeague.setTimeEnd(timeend.getTime());

    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày kết thúc lơn hơn ngày bắt đầu");
    }

  }

  onClickAvatar() {
    this.changeLogo.emit()
  }

  onClickCover() {
    this.changeCover.emit()
  }
  getNormalizeAvatar() {
    return this.mAppModule.getLogo(normalizeURL(this.avatar));
  }
  getNormalizeCover() {
    return this.mAppModule.getCover(normalizeURL(this.cover));
  }
}
