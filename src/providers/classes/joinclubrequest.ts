import { ParamsKey } from "./paramkeys";

export class JoinClubRequest {

    private requestID: number = -1;

    private playerID: number = -1;

    private clubID: number = -1;

    private state: number = -1;

    private type: number = -1;

    private timeCreated: number = 0;

    constructor() { }

    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.REQUEST_ID)) {
            this.setRequestID(object.getInt(ParamsKey.REQUEST_ID));
        }

        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setPlayerID(object.getInt(ParamsKey.USER_ID));
        }

        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
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

    public getPlayerID(): number {
        return this.playerID;
    }

    public setPlayerID(playerID: number) {
        this.playerID = playerID;
    }

    public getClubID(): number {
        return this.clubID;
    }

    public setClubID(clubID: number) {
        this.clubID = clubID;
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

    public getTimeCreated(): number {
        return this.timeCreated;
    }

    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}