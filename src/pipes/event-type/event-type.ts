import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the EventTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'eventType',
})
export class EventTypePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(type: number): string {
    let icon: string = "";
    switch (type) {
      case 0:
        icon = "bd69-card";
        break;
      case 1:
        icon = "bd69-card";
        break;
      case 2:
        icon = "bd69-ball1";
        break;
      case 3:
        icon = "bd69-ball1";
        break;
      case 4:
        icon = "bd69-change";
        break;
      case 5:
        icon = "bd69-penalty";
        break;
      case 6:
        icon = "bd69-ball";
        break;
      case 7:
        icon = "bd69-hourglass";
        break;
      case 8:
        icon = "bd69-clock";
        break;
      case 9:
        icon = "bd69-ball";
        break;
      case 10:
        icon = "bd69-hourglass";
        break;
      case 11:
        icon = "bd69-whistle";
        break;
      default:
        icon = "bd69-ball1"
        break;
    }
    return icon;
  }
}
