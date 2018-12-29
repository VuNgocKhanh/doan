import { Component, Input, Output, EventEmitter, Renderer, ViewChild } from '@angular/core';
import { Searchbar } from 'ionic-angular';

/**
 * Generated class for the Bd69HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bd69-header',
  templateUrl: 'bd69-header.html'
})
export class Bd69HeaderComponent {
  @ViewChild(Searchbar) searchBar: Searchbar;
  @Input("icon-right") icon_right: string = "";
  @Input("title") title: string = "";
  @Input("searchbar") searchbar: boolean = false;
  placeholder: string = "Tìm kiếm";

  @Output("onClickRight") mEventemiter = new EventEmitter();
  text: string;

  constructor(
    private renderer: Renderer) {
    this.text = 'Hello World';
  }

  ngAfterViewInit() {
  }

  onClickRight() {
    this.mEventemiter.emit();
  }

}
