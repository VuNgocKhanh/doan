import { Utils } from "../app/utils";
import { CalendarUtils } from "./calendar-utils";
import { CalendarYear } from "./calendar-year";

export class CalendarManager {
    years: Map<number, CalendarYear> = new Map<number, CalendarYear>();
  
    private static _instance: CalendarManager;
    private constructor() {}
    public static getInstance(): CalendarManager {
        if (this._instance == null) {
            this._instance = new CalendarManager();
        }
        return this._instance;
    }

    public hasYear(yy: number): boolean {
        return this.years.has(yy);
    }

    public getYear(yy: number): CalendarYear {
        if (!this.hasYear(yy)) {
            let year = new CalendarYear();
            year.setYear(yy);
            this.years.set(yy, year);
        }
        return this.years.get(yy);
    }

}