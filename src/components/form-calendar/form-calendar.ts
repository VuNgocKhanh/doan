import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';

/**
 * Generated class for the FormCalendarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'form-calendar',
  templateUrl: 'form-calendar.html'
})
export class FormCalendarComponent {

  @Input("name") name: string;
  @Input("selected") mCalendarDate: CalendarDate;
  @Input("disabled") disabled: boolean = false;
  @Output("onDateChange") mEventEmitter = new EventEmitter();
  constructor(
    public mAppModule: AppModuleProvider
  ) {
  }

  ngAfterViewInit(){
    
  }

  selectDate(){
    if(this.disabled) return;
    this.mAppModule.showModal("SelectDatePage",{params: this.mCalendarDate},(res)=>{
      if(res){
        this.mCalendarDate = res;
        this.mEventEmitter.emit(res);
      }
    })
  }
}
