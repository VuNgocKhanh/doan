
export class CalendarDate {
    public dd: number = -1;
    public mm: number = -1;
    public yy: number = -1;
    constructor() {

    }

    public setDate(dd: number, mm: number, yy: number): void {
        this.dd = dd;
        this.mm = mm;
        this.yy = yy;
    }
    public setTime(date: Date): void {
        this.dd = date.getDate();
        this.mm = date.getMonth();
        this.yy = date.getFullYear();
    }

    public setDateFromString(dateString: string){
        let arr = dateString.split("/");
        this.dd = parseInt(arr[0]);
        this.mm = parseInt(arr[1]);
        this.yy = parseInt(arr[2]);
    }
    
    public getDay(): number {
        return this.dd;
    }
    public getMonth(): number {
        return this.mm;
    }
    public getYear(): number {
        return this.yy;
    }

    getId(): string {
        return this.dd + "" + this.mm + "" + this.yy;
    }

    getDateString(): string{
        return (this.dd < 10 ? "0" : "") + this.dd +"/"+ (this.mm + 1 < 10 ? "0": "") + (this.mm + 1) +"/"+ this.yy; 
    }

}