import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the MenuHoziComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu-hozi',
  templateUrl: 'menu-hozi.html'
})
export class MenuHoziComponent {
  @Input("menuList") menuList: Array<{id: number, name: string, icon?:string}> = [];
  @Output("onSelect") mEvent = new EventEmitter();
  menuSelectedID: number = 0;
  constructor() {
  }

  selectMenu(menu){
    this.menuSelectedID = menu.id;
    this.mEvent.emit(this.menuSelectedID);
  }
}
