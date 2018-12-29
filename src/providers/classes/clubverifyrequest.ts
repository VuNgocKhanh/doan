import { ParamsKey } from "./paramkeys";

export class ClubVerifyRequest {

    private requestID: number = -1;

    private clubID: number = -1;

    private leagueID: number = -1;

    private state: number = -1;

    private type: number = -1;

    private resultCode: number = -1;

    private message: String = "";

    private reason: String = "";

    private timeCreated: number = 0;

    constructor() { }


    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.REQUEST_ID)) {
            this.setRequestID(object.getInt(ParamsKey.REQUEST_ID));
        }

        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.RESULT_CODE)) {
            this.setResultCode(object.getInt(ParamsKey.RESULT_CODE));
        }

        if (object.containsKey(ParamsKey.MESSAGE)) {
            this.setMessage(object.getUtfString(ParamsKey.MESSAGE));
        }

        if (object.containsKey(ParamsKey.REASON)) {
            this.setReason(object.getUtfString(ParamsKey.REASON));
        }

        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

    }

    public getRequestID(): number {
        return this.requestID;
    }

    public setRequestID(requestID: number) {
        this.requestID = requestID;
    }

    public getClubID(): number {
        return this.clubID;
    }

    public setClubID(clubID: number) {
        this.clubID = clubID;
    }

    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number) {
        this.state = state;
    }

    public getType(): number {
        return this.type;
    }

    public setType(type: number) {
        this.type = type;
    }

    public getResultCode(): number {
        return this.resultCode;
    }

    public setResultCode(resultCode: number) {
        this.resultCode = resultCode;
    }

    public getMessage(): String {
        return this.message;
    }

    public setMessage(message: String) {
        this.message = message;
    }

    public getReason(): String {
        return this.reason;
    }

    public setReason(reason: String) {
        this.reason = reason;
    }

    public getTimeCreated(): number {
        return this.timeCreated;
    }

    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}