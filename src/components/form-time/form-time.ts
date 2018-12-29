import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppModuleProvider } from '../../providers/app-module/app-module';

/**
 * Generated class for the FormTimeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'form-time',
  templateUrl: 'form-time.html'
})
export class FormTimeComponent {
  @Input("name") name: string;
  @Output("onChange") mEventEmitter = new EventEmitter();

  time = {
    hour: 0,
    minutes: 0
  };

  timeString = "Chọn thời gian";
  constructor(public mAppModule: AppModuleProvider) {
  }

  selectTime(){
    this.mAppModule.showModal("SelectTimePage",{params: [this.time.hour,this.time.minutes]},(res)=>{
      if(res){
        this.time = {
          hour: res[0],
          minutes: res[1]
        };
        this.timeString = this.getTimeString();
        this.mEventEmitter.emit(this.time);
      }
    })
  }

  getTimeString(): string{
    return (this.time.hour < 10 ? "0" : "")+ this.time.hour + ":" + (this.time.minutes < 10 ? "0" : "") + this.time.minutes;
  }
}
