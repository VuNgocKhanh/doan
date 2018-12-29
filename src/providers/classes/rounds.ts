import { ParamsKey } from "./paramkeys";


var SFS2X = window['SFS2X'];

export class Rounds {
    private roundiD: number = -1;
    private name: string = "";
    private description: string = "";
    private state: number = -1;
    private type: number = -1;
    private leagueID: number = -1;
    private timeCreated : number = -1;
    private priority : number = -1;

    constructor() { }

    public fromSFSObject(object: any){
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.ROUND_ID)) {
            this.setRoundiD(object.getInt(ParamsKey.ROUND_ID));
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.PRIORITY)) {
            this.setPriority(object.getInt(ParamsKey.PRIORITY));
        }

        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

    }

    public toSFSObjectAdd(){
        let obj = new window['SFS2X'].SFSObject();
        obj.putUtfString(ParamsKey.NAME, this.getName());
        obj.putInt(ParamsKey.LEAGUE_ID,this.getLeagueID());
        return obj;
    }

    public toSFSObject(){
        let obj = new window['SFS2X'].SFSObject();
        if(this.roundiD > -1)obj.putInt(ParamsKey.ROUND_ID,this.getRoundiD());
        obj.putUtfString(ParamsKey.NAME,this.getName());
        obj.putInt(ParamsKey.STATE,this.getState());
        obj.putInt(ParamsKey.TYPE,this.getType());
        obj.putInt(ParamsKey.LEAGUE_ID,this.getLeagueID());
        return obj;
    }

    public getRoundiD(): number {
        return this.roundiD;
    }

    public setRoundiD(roundiD: number) {
        this.roundiD = roundiD;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(name: string) {
        this.description = name;
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

    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }

    public getTimeCreated(): number {
        return this.timeCreated;
    }

    public setTimeCreated(time: number) {
        this.timeCreated = time;
    }

    public getPriority(): number {
        return this.priority;
    }

    public setPriority(priority: number) {
        this.priority = priority;
    }
}