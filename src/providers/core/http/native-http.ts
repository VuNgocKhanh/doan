
import { HTTP } from "@ionic-native/http";

export class NativeHttp {

    mHeader: Headers;

    mDebugEnable: boolean = false;

    mHTTP: HTTP;

    constructor() {
        this.getCommonHeader();
    }

    setHttp(http: HTTP) {
        this.mHTTP = http;
    }

    public setDebugEnable(enable: boolean) {
        this.mDebugEnable = enable;
    }

    public getHttp(): HTTP {
        return this.mHTTP;
    }

    public getCommonHeader() {
        if (!this.mHeader) {
            this.mHeader = new Headers();
            this.mHeader.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        }
        return this.mHeader;
    }
    public requestGet(url: string, params: string, headers) {
        return new Promise((success, fail) => {
            this.mHTTP.get(url, params, headers).then(data => { if (data.status == 200) success(JSON.parse(data.data)); else fail(data); }, error => { fail(error); });
        });
    }

    public requestPost(url: string, params, headers) {


        return new Promise((success, fail) => {
            this.mHTTP.post(url, params, headers).then(data => { if (data.status == 200) success(JSON.parse(data.data)); else fail(data); }, error => { fail(error); });
        });
    }

    public requestPut(url: string, params, headers) {


        return new Promise((success, fail) => {
            this.mHTTP.put(url, params, headers).then(data => { if (data.status == 200) success(JSON.parse(data.data)); else fail(data); }, error => { fail(error); });
        });
    }
}