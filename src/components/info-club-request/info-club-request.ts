import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Clubs } from '../../providers/classes/clubs';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Player } from '../../providers/classes/player';

/**
 * Generated class for the InfoClubRequestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
export interface Leader {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
}
@Component({
  selector: 'info-club-request',
  templateUrl: 'info-club-request.html'
})
export class InfoClubRequestComponent {

  @Input("club") mClub: Clubs = new Clubs();
  @Input("disabled") disabled: boolean = false;
  @Input("hiddenClub") hiddenClub: boolean = false;
  @Input("presentName") presentName: string = "";
  @Input("leader") mLeader: Player;
  
  placeholder: string = "Ông bầu";
  @Output("onSelectClub") mEventEmitter1 = new EventEmitter();
  @Output("onSelectLeader") mEventEmitter2 = new EventEmitter();
  @Output("onInput") mEventEmitter3 = new EventEmitter();



  constructor(private mAppModule: AppModuleProvider) {
    this.mClub.setName("Chọn câu lạc bộ");
  }

  ngAfterViewInit() {
  }

  showListClub() {
    this.mEventEmitter1.emit();
  }

  showListLeader() {
    this.mEventEmitter2.emit();
  }

  onInput(){
    this.mEventEmitter3.emit(this.presentName);
  }

}
