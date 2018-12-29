import { Component, Input } from '@angular/core';
import { Rule } from '../../providers/classes/rule';
import { Leagues } from '../../providers/classes/league';
import { Utils } from '../../providers/core/app/utils';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';
import { AppModuleProvider } from '../../providers/app-module/app-module';

/**
 * Generated class for the RuleOfLeagueComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rule-of-league',
  templateUrl: 'rule-of-league.html'
})
export class RuleOfLeagueComponent {
  @Input("rule") mRuleOfLeague: Rule;
  @Input("disabled") disabled: boolean = false;

  constructor(private mAppModule: AppModuleProvider) {
    this.mRuleOfLeague = new Rule();
  }


  getDateEnd(date: CalendarDate) {

    let timeStart = this.mRuleOfLeague.getRecordStartDate();

    if (date.yy > timeStart.yy || (date.mm > timeStart.mm && date.yy >= timeStart.yy) || timeStart.dd == -1 || (date.dd > timeStart.dd && date.mm >= timeStart.mm && date.yy >= timeStart.yy)) {
      this.mRuleOfLeague.setRecordEnd(Utils.getTimeStamp(date.dd, date.mm + 1, date.yy));
    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày kết thúc lớn hơn ngày bắt đầu");
    }

  }

  getDateStart(date: CalendarDate) {
    let timeend = this.mRuleOfLeague.getRecordEndDate();
    
    if (date.yy < timeend.yy || (date.mm < timeend.mm && date.yy <= timeend.yy) || timeend.dd == -1 || (date.dd < timeend.dd && date.mm <= timeend.mm && date.yy <= timeend.yy)) {
      this.mRuleOfLeague.setRecordStart(Utils.getTimeStamp(date.dd, date.mm + 1, date.yy));
    } else {
      this.mAppModule.showToast("Bạn cần chọn ngày bắt đầu nhỏ hơn ngày kết thúc");
    }
  }

  getEnableChange(){
    
  }
}
