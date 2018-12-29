import { CalendarUtils } from "../calendar/calendar-utils";
import { Match } from "../../classes/matches";

export class Utils {
  public static reg_phone = /^[0-9+]{6,12}$/;
  public static reg_number = /^[0-9+]$/;
  public static reg_username = /^[A-Za-z0-9_-]{6,20}$/;
  public static reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public static isNumber(char: string) {
    return this.reg_number.test(char);
  }
  public static isValidUsername(username) {
    return this.reg_username.test(username);
  }
  public static isValidPhone(phone) {
    return this.reg_phone.test(phone);
  }
  public static isValidEmail(email) {
    return this.reg_email.test(email);
  }

  public static clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
  public static getStringNumber(val: number): string {
    return ((val < 10) ? "0" : "") + val;
  }
  public static nFormatter(num: number, units?: Array<string>) {
    let unitArray = ["G", "M", "K"];
    if (units && units != undefined && units.length >= 3) unitArray = units;
    let isNegative = false
    if (num < 0) {
      isNegative = true
    }
    num = Math.abs(num)
    let formattedNumber = '';
    if (num >= 1000000000) {
      formattedNumber = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + unitArray[0];
    } else if (num >= 1000000) {
      formattedNumber = (num / 1000000).toFixed(1).replace(/\.0$/, '') + unitArray[1];
    } else if (num >= 1000) {
      formattedNumber = (num / 1000).toFixed(1).replace(/\.0$/, '') + unitArray[2];
    } else {
      formattedNumber = num + '';
    }
    if (isNegative) { formattedNumber = '-' + formattedNumber }
    return formattedNumber;
  }

  public static bodauTiengViet(str: string): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    // str = str.replace(/\s/g, '-');
    return str;
  }
  public static kiemTraToanDauCach(str: string): boolean {
    return str.trim().length == 0;
  }
  public static randInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  public static getRequestDate(date: Date): string {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  public static getRequestDateFromDDMMYY(dd: number,mm: number,yy: number): string {
    return yy + "-" + (mm < 10 ? "0" : "") + mm + "-" + (dd < 10 ? "0" : "") + dd;
  }

  
  public static getViewDate(date: Date): string {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return (d < 10 ? "0" : "") + d + "/" + (m < 10 ? "0" : "") + m + "/" + date.getFullYear();
  }

  public static getTimeBefore(date: Date, days: number): number {
    return date.getTime() - days * 86400000;
  }
  public static getTimeAfter(date: Date, days: number): number {
    return date.getTime() + days * 86400000;
  }

  static UniqueZIndex: number = 10;
  public static getTopZIndex() {
    return this.UniqueZIndex++;
  }

  public static getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  public static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  public static formatNumber(num: number, splitChar: string) {
    let arr = [];
    num = Math.round(num);
    let numStr = num.toString();
    arr = numStr.split('');
    let length = arr.length;
    for (let i = 1; i <= length; i++) {
      if (i % 3 == 0 && i < length) arr.splice(length - i, 0, splitChar);
    }
    return arr.join('');
  }

  public static _FormatDateYYYYMMDDHHSS(date: Date): string {
    if (date) {
      return date.getFullYear() + "-" + Utils.getStringNumber(date.getMonth() + 1) + "-" + Utils.getStringNumber(date.getDate()) + " " + Utils.getStringNumber(date.getHours()) + ":" + Utils.getStringNumber(date.getMinutes()) + ":" + Utils.getStringNumber(date.getSeconds());
    }
    return "";
  }

  public static _convertNumberTimeToString(time: number): string{
    let hour = Math.floor(time / 60);
    let mins = time - hour * 60; 
    return hour + "h" + (mins > 9 ? "" : "0") + mins;
  }

  public static getFirstDayInWeek(){
    let today = new Date();
    let dayinweek = today.getDay();
    let number_day_after: number = 0;
    if(dayinweek == 0){
      number_day_after = 6;
    }else{
      number_day_after = dayinweek - 1;
    }

    
  }

  public static getTimeNotification(date: Date): string{
    let now = new Date();
    if(now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()){
      return this.getTimeDistance(date);
    }else{
      return CalendarUtils.getDayOfTheWeekName(date.getDay()) + " lúc " + date.getHours() + ":" + date.getMinutes();
    }
  }

  public static getTimeStamp(dd: number,mm: number,yy: number): number{
    let date =  new Date(yy+"-"+this.getStringNumber(mm)+"-"+this.getStringNumber(dd));
    return date.getTime();
  }

  public static getTimeDistance(date: Date): string{
    var today =  new Date();
    let distance = today.getTime() - date.getTime();
    if(distance < 0)distance = 0;
    let hour = Math.floor(distance / (1000 * 60 * 60));
    let minutes = Math.floor(distance / (1000 * 60));
    let second = Math.floor(distance / 1000);

    if(hour == 0 && minutes == 0 && second == 0){
      return "Vừa xong";
    }
    if(hour == 0 && minutes == 0 && second > 0){
      return second + " giây trước";
    }
    if(hour == 0 && minutes > 0){
      return minutes + " phút trước";
    }
    if(hour > 0){
      return hour + " giờ trước";
    }
  }
}