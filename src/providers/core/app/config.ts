export class Config {

    public mData: any = null;

    constructor() { }

    public setData(data): void {
        if (data) {
            this.mData = data;
        }
    }

    public hasData(): boolean {
        return this.mData != null;
    }

    public get(key: string) {
        if (this.hasData()) {
            if (key in this.mData) {
                return this.mData[key];
            }
        }
        return null;
    }
}