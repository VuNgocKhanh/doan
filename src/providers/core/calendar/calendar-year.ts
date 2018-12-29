import { CalendarMonth } from './calendar-month';

export class CalendarYear {
    yy: number = -1;
    months: Array<CalendarMonth> = [];   
   
    public constructor() {

    }

    public setYear(yy: number) {
        if (this.yy == yy) return;
        this.yy = yy;
        this.months = [];
        for (let mm = 0; mm < 12; mm++) {
            let month = new CalendarMonth();
            month.setMonth(mm, yy);
            this.months.push(month);
        }
    }

}
