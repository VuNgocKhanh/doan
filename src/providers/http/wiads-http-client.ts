

import { Headers } from "@angular/http";
import { HttpClient } from '../core/http/http-client';

export class WiadsHttpClient extends HttpClient {
    mUrl = "";
    mClientKey = "";
    mToken: string = "";

    constructor() {
        super();
    }

    createHeaders() {
        if (this.mUseNativeHttp) {
            this.mNativeHttp.setHeader(this.mUrl, 'client_key', this.mClientKey);
            this.mNativeHttp.setHeader(this.mUrl, 'Content-type', 'application/json; charset=utf-8');
        } else {
            this.mAngularHeader = new Headers({
                client_key: this.mClientKey,
                content_type: 'application/json; charset=utf-8'
            });
        }

    }


}