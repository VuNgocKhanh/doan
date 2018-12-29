export class ParamBuilder {
    fields = [];
    private static _instance: ParamBuilder;
    constructor() { }

    public static builder() {
        if (this._instance == null || this._instance == undefined) this._instance = new ParamBuilder();
        this._instance.resetFields();
        return this._instance;
    }
    public static newBuilder() {
        return new ParamBuilder();
    }
    private resetFields() {
        this.fields = [];
    }
    public add(key, value) {
        this.fields.push({
            key: key,
            value: value
        });
        return this;
    }

    public addIgnoreNull(key, value) {
        if (value != null) {
            this.fields.push({
                key: key,
                value: value
            });
        }
        return this;
    }
    public addStringIgnoreEmpty(key, value: string) {
        if (value.length > 0) {
            this.fields.push({
                key: key,
                value: value
            });
        }
        return this;
    }
    public build(): string {
        let params: string = '';
        for (var i = 0; i < this.fields.length; i++) {
            params += this.fields[i].key + '=' + this.fields[i].value;
            if (i != this.fields.length - 1) {
                params += '&';
            }
        }
        return params;
    }

    public buildNative() {
        let _params = {};
        for (let field of this.fields) {
            _params[field.key] = field.value;
        }
        return _params;
    }
}