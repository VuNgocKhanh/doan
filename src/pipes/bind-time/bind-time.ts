import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the BindTimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'bindTime',
})
export class BindTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any) {
    let timeNow = new Date().getTime();
    let valueTime;
    if (value) {
      valueTime = new Date(value)
    }
    let date = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]

    if ((valueTime.getTime() - timeNow) > 0 && (valueTime.getTime() - timeNow) < 604800) {
      let time = valueTime.getTime() - timeNow;
      if (time < 86400000) {
        return "Còn " + Math.floor(time / 3600000) + " giờ";
      } else if (time > 86400000 && time < 2592000000) {
        return "Còn " + Math.floor(time / 86400000) + " ngày";
      } else if (time > 2592000000 && time < 31536000000) {
        return "Còn " + Math.floor(time / 2592000000) + "tháng";
      } else if (time > 31536000000) {
        return "Còn " + Math.floor(time / 31536000000) + " năm";
      }
    } else {
      return date[valueTime.getDay()] + ", " + valueTime.getDate() + " Tháng " + (valueTime.getMonth() + 1) + ", " + valueTime.getFullYear();
    }
  }
}
