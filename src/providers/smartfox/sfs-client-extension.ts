import { ParamsKey } from "../classes/paramkeys";

export interface SfsArrayExtension {
    content: any;
    nextPage: number;
    page: number;
    array: any;
}

export interface SfsInfoExtension{
    content: any;
    info: any;
}

export class SfsClientBaseExtension {
    constructor() {

    }

    public doCheckStatusParams(params): boolean {
        if (params.getInt(ParamsKey.STATUS) == 1) {
            return true;
        } else {
            return false;
        }
    }

    public doParseArrayExtensions(params): SfsArrayExtension {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        let nextPage = -1;
        let page = 0;
        let array: any = null;
        if (content) {
            if (content.containsKey(ParamsKey.NEXT)) {
                nextPage = content.getInt(ParamsKey.NEXT);
            }
            page = content.getInt(ParamsKey.PAGE);
            if (content.containsKey(ParamsKey.ARRAY)) {
                array = content.getSFSArray(ParamsKey.ARRAY);
            }

            return { nextPage: nextPage, page: page, array: array, content: content };
        } else {
            return null;
        }
    }

    public doParseInfo(params): SfsInfoExtension{
       
        let content = params.getSFSObject(ParamsKey.CONTENT);
        if (content) {
            if (content.containsKey(ParamsKey.INFO)) {
                return { content: content, info: content.getSFSObject(ParamsKey.INFO) };
            } else {
                return { content: content, info: null };
            }
        } else {
            return null;
        }
    }

}