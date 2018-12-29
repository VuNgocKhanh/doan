
import { Http, Headers } from "@angular/http";

import { HTTP } from "@ionic-native/http";

import { ParamBuilder } from "./param-builder";

import { Config } from "../app/config";

export class HttpClient extends Config {

    public mAngularHttp: Http;

    public mNativeHttp: HTTP;

    public mAngularHeader: Headers;

    public mDebugEnable: boolean = false;

    public mUseNativeHttp: boolean = false;

    constructor() {
        super();
    }

    public createClient(angularHttp: Http, nativeHttp: HTTP) {
        if (this.mAngularHttp && this.mNativeHttp) return;
        this.mAngularHttp = angularHttp;
        this.mNativeHttp = nativeHttp;
    }

    setUseNativeHttp(useNative: boolean) {
        this.mUseNativeHttp = useNative;
    }


    getCommonAngularHeader() {
        if (!this.mAngularHeader) {
            this.mAngularHeader = new Headers();
            this.mAngularHeader.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        }
        return this.mAngularHeader
    }

    public setDebugEnable(enable: boolean) {
        this.mDebugEnable = enable;
    }

    public getAngularHttp(): Http {
        return this.mAngularHttp;
    }

    public requestGet(url: string, paramBuilder: ParamBuilder, headers?: Headers) {
        if (this.mUseNativeHttp) return this._NativeRequestGet(url, paramBuilder.buildNative(), {});
        return this._AngularRequestGet(url, paramBuilder.build(), headers ? headers : this.getCommonAngularHeader());
    }

    public requestPost(url: string, paramBuilder: ParamBuilder, headers?: Headers) {
        if (this.mUseNativeHttp) return this._NativeRequestPost(url, paramBuilder.buildNative(), {});
        return this._AngularRequestPost(url, paramBuilder.build(), headers ? headers : this.getCommonAngularHeader());
    }
    public requestPut(url: string, paramBuilder: ParamBuilder, headers?: Headers) {
        if (this.mUseNativeHttp) return this._NativeRequestPut(url, paramBuilder.buildNative(), {});
        return this._AngularRequestPut(url, paramBuilder.build(), headers ? headers : this.getCommonAngularHeader());
    }

    public _AngularRequestGet(url: string, params: string, headers) {
        return new Promise((success, fail) => {
            this.mAngularHttp.get(url + "?" + params, {
                headers: headers
            }).subscribe(data => { success(data.json()); }, error => { fail(error.json()); });
        });
    }

    public _AngularRequestPost(url: string, params: string, headers: Headers) {
        params = params.replace(/ /g, "%20");
        return new Promise((success, fail) => {
            this.mAngularHttp.post(url, params, {
                headers: headers
            }).subscribe(data => { success(data.json()); }, error => { fail(error.json()); });
        });
    }


    public _AngularRequestPut(url: string, params: string, headers) {
        params = params.replace(/ /g, "%20");
        return new Promise((success, fail) => {
            this.mAngularHttp.put(url, params, { headers: headers }).subscribe(data => { success(data.json()); }, error => { fail(error.json()); });
        });
    }



    public _NativeRequestGet(url: string, params, headers) {

        return new Promise((success, fail) => {
            this.mNativeHttp.get(url, params, headers).then(data => { if (data.status == 200) success(JSON.parse(data.data)); else fail(data); }, error => { fail(error); });
        });
    }
    public _NativeRequestPost(url: string, params, headers) {

        return new Promise((success, fail) => {
            this.mNativeHttp.post(url, params, headers).then(data => { if (data.status == 200) success(JSON.parse(data.data)); else fail(data); }, error => { fail(error); });
        });
    }
    public _NativeRequestPut(url: string, params, headers) {
        return new Promise((success, fail) => {
            this.mNativeHttp.put(url, params, headers).then(data => { if (data.status == 200) success(JSON.parse(data.data)); else fail(data); }, error => { fail(error); });
        });
    }
}