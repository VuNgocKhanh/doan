import { Utils } from '../app/utils';
import { CalendarUtils } from './calendar-utils';
import { CalendarDate } from './calendar-date';

export class CalendarMonth {
    mm: number = -1;
    yy: number = -1;
    dates: Array<CalendarDate> = [];

    constructor() {

    }

    getMonthString(): string{
        return ((this.mm + 1 < 10) ? "0" : "") + (this.mm + 1);
    }
    getYearString(): string{
        return this.yy + "";
    }
    public _CloneFrom(other: CalendarMonth): void {
        if (other) {
            this.mm = other.mm;
            this.yy = other.yy;
            this.dates = other.dates;
        }
    }

    private addDate(date: CalendarDate) {
        this.dates.push(date);
    }

    public setMonth(mm: number, yy: number): void {
        if (this.mm == mm && this.yy == yy) return;
        this.mm = mm;
        this.yy = yy;
        this.dates = [];

        let firstDate = new Date(yy, mm, 1, 12, 0, 0);
        let dayOfTheFirstDate: number = firstDate.getDay();
        if (dayOfTheFirstDate == 0) {
            dayOfTheFirstDate = 7;
        }
        let maxDate = CalendarUtils._TinhSoNgayTrongThang(mm, yy);

        for (let i = 0; i < dayOfTheFirstDate - 1; i++) {
            let date = new CalendarDate();

            this.addDate(date);
        }

        for (let i = 1; i <= maxDate; i++) {
            let date = new CalendarDate();
            date.yy = yy;
            date.mm = mm;
            date.dd = i;
            this.addDate(date);
        }

        for(let i = this.dates.length; i < 42; i ++){
            let date = new CalendarDate();

            this.addDate(date);
        }
    }
}
