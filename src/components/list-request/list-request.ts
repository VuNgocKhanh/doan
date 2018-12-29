import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../providers/classes/user';
import { AppModuleProvider } from '../../providers/app-module/app-module';

/**
 * Generated class for the ListRequestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-request',
  templateUrl: 'list-request.html'
})
export class ListRequestComponent {
  @Input("mListUser") mListUser: Array<User> = [];
  @Input("clubId") clubID: number = -1;

  @Output("onAccept") mEventAccept = new EventEmitter();
  @Output("onDeline") mEventDeline = new EventEmitter();
  text: string

  constructor(private mAppmodule: AppModuleProvider) {
    this.text = 'Hello World';
  }

  

  onSelectAccept(user: User){
    this.mEventAccept.emit(user);
  }

  onDelineAccept(user: User){
    this.mEventDeline.emit(user);
  }
}
