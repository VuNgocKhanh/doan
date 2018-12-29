import { Component, Input } from '@angular/core';

/**
 * Generated class for the ListItemAvatarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-item-avatar',
  templateUrl: 'list-item-avatar.html'
})
export class ListItemAvatarComponent {
  @Input('listItem') listItem: Array<any> = [];
  text: string;

  constructor() {
    this.text = 'Hello World';
  }

  ngAfterViewInit(){
    
  }

}
