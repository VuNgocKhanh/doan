import { Bd69SFSCmd } from "../smartfox/bd69-sfs-cmd";
import { ParamsKey } from "../classes/paramkeys";
import { Leagues } from "../classes/league";
import { SfsClientBaseExtension } from "../smartfox/sfs-client-extension";
import { ClubInLeague } from "../classes/clubinleague";

export class ParseModule extends SfsClientBaseExtension {
    public static _instance: ParseModule

    public static getInstance(): ParseModule {
        if (this._instance == null) {
            this._instance = new ParseModule();
        }
        return this._instance;
    }

    constructor() {
        super();
    }


    doParseParams(cmd, params) {
        if (this.doCheckStatusParams(params)) {
            return this.resolveParamsWithCMD(cmd, params);
        } else {
            return params.getUtfString(ParamsKey.MESSAGE);
        }
    }

    public resolveParamsWithCMD(cmd, params) {
        if (cmd == Bd69SFSCmd.GET_LEAGUE_LIST) {
            return this.onParseGET_LEAGUE_LIST(params);
        }
        if (cmd == Bd69SFSCmd.GET_TABLE_OF_LEAGUE) {
            return this.onParseGET_TABLE_OF_LEAGUE(params);
        }
    }


    onParseGET_LEAGUE_LIST(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let arrayLeague: Array<Leagues> = [];
        for (let i = 0; i < array.size(); i++) {
            let sfsobject = array.getSFSObject(i);
            let league = new Leagues();
            league.fromSFSobject(sfsobject);
            arrayLeague.push(league);
        }
        return arrayLeague;
    }

    onParseGET_TABLE_OF_LEAGUE(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let arrayObject: Array<ClubInLeague> = [];
        for (let i = 0; i < array.size(); i++) {
            let sfsobject = array.getSFSObject(i);
            let object = new ClubInLeague();
            object.fromSFSobject(sfsobject);
            arrayObject.push(object);
        }
        return arrayObject;
    }
}