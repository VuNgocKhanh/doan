
export class MenuItem {
    public id: number = -1;
    public name: string = "";
    public icon: string = "";
    public color: string = "";
    public page: string = "";

    constructor() {

    }

    public setID(id: number): void {
        this.id = id;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public getName(): string {
        return this.name;
    }

    public setIcon(icon: string): void {
        this.icon = icon;
    }
    public getIcon(): string {
        return this.icon;
    }
    public setColor(color: string): void {
        this.color = color;
    }
    public getColor(): string {
        return this.color;
    }
    public setPage(page: string): void {
        this.page = page;
    }
    public getPage(): string {
        return this.page;
    }
}