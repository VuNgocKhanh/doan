import { Component } from '@angular/core';
import { MenuItem } from '../../providers/core/app/menu-item';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the ManageLeagueComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
export interface MenuItems{
  id: number;
  name: string;
  icon: string;
  page: string;
}
@Component({
  selector: 'manage-league',
  templateUrl: 'manage-league.html'
})
export class ManageLeagueComponent {

  text: string;
  menus: Array<MenuItems> = [
    {id: 0,name: "Danh sách đội bóng", icon: "bd69-club",page: "ClubListInleaguePage"},
    {id: 1,name: "Lịch thi đấu", icon: "bd69-calendar",page: ""},
    {id: 2,name: "Trọng tài", icon: "bd69-referen",page: ""},
    {id: 3,name: "Sân bóng", icon: "bd69-stadium",page: ""},
    {id: 4,name: "Quản lí giải đấu", icon: "bd69-manager",page: ""}
  ];
  constructor(public navCtrl: NavController) {
    this.text = 'Hello World';
  }

  goToPage(item){
    if(item.page){
      this.navCtrl.push(item.page);
    }
  }

}
