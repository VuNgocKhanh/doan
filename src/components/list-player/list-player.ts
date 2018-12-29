import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Player } from '../../providers/classes/player';

/**
 * Generated class for the ListPlayerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-player',
  templateUrl: 'list-player.html'
})
export class ListPlayerComponent {
  @Input("listPlayer") listPlayer: Array<Player> = [];
  @Input("name") name: string = "";

  @Output("setLead") setLead = new EventEmitter();
  @Output("setManage") setManage = new EventEmitter();
  @Output("delete") deletePlayer = new EventEmitter();

  title_position = "Vị trí";
  title_number_player = "Số áo";
  title: string = "Danh sách cầu thủ";
  lead = "Đội trưởng";
  manage = "Quản lý";
  delete = "Xóa";

  constructor(
    public mAlerController: AlertController
  ) { }

  onClickSetLead(data: any) {
    this.showConfirmAlert("Đội trưởng?", "", this.setLead, data);
  }

  onClickSetManage(data: any) {
    this.showConfirmAlert("Quản lý?", "", this.setManage, data);
  }

  onClickDelete(data: any, index: number) {
    this.showConfirmAlert("Xóa player?", "", this.deletePlayer, index)
  }

  public showConfirmAlert(title?: string, message?: string, event?: any, data?: any): void {
    let alert = this.mAlerController.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "Hủy",
          role: "cancel"
        }, {
          text: "Ok",
          handler: () => {
            event.emit(data);
          }
        }
      ]
    });
    alert.present();
  }

}
