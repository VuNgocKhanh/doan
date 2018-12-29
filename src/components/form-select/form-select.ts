import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Select } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the FormSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'form-select',
  templateUrl: 'form-select.html'
})
export class FormSelectComponent {
  @Input("name") name: string = "Chọn";
  @Input("values") values: Array<{id: number, name: string}> = [];
  @Input("selected") mValue: number = -1;
  @ViewChild(Select) mySelect: Select;
  @Output("onChange") mEventEmitter = new EventEmitter();
  sub: Subscription = null;
  constructor() {
  }



  openSelect(){
    this.mySelect.open();
  }

  ngAfterViewInit(){
    this.mySelect.selectOptions = {
      title: this.name
    }
    this.sub = this.mySelect.ionChange.asObservable().subscribe((data)=>{
      this.onChange();
    })
  }

  ionViewDidLeave(){
    if(this.sub)this.sub.unsubscribe();
  }

  onChange(){
    this.mEventEmitter.emit(this.mValue);
  }
}
