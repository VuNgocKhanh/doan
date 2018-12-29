import { ParamsKey } from "./paramkeys";
import { Player } from "./player";
import { Clubs } from "./clubs";

var SFS2X = window['SFS2X'];

export class MatchEvent {
    
    private eventID: number = -1;
    
    private matchID: number = -1;

    private leagueID: number = -1;
    
    private clubID: number = -1;
    
    private playerID1: number = -1;
    
    private playerID2: number = -1;
    
    private name:string = "";
    
    private description:string = "";
    
    private type: number = -1;
    
    private state: number = -1;
    
    private time: number = 0;
    
    private timeCreated: number = 0;


    constructor(){}
    
    
    // public toSFSobject(): ISFSobject {
    //     let obj: ISFSobject = new SFSobject();
    //     obj.putInt(ParamsKey.EVENT_ID, this.getEventID());
    //     obj.putInt(ParamsKey.MATCH_ID, this.getMatchID());
    //     obj.putInt(ParamsKey.CLUB_ID, this.getClubID());
    //     obj.putInt(ParamsKey.LEAGUE_ID, this.getLeagueID());
    //     obj.putInt(ParamsKey.PLAYER_ID_1, this.getPlayerID1());
    //     obj.putInt(ParamsKey.PLAYER_ID_2, this.getPlayerID2());
    //     obj.putUtfString(ParamsKey.NAME, this.getName());
    //     obj.putUtfString(ParamsKey.DESCRIPTION, this.getDescription());
    //     obj.putInt(ParamsKey.TYPE, this.getType());
    //     obj.putInt(ParamsKey.STATE, this.getState());
    //     obj.putInt(ParamsKey.TIME, this.getTime());
    //     obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
    //     return obj;
    // }
    
    public fromObject(object : MatchEvent){
        this.setName(object.getName());
        this.setTime(object.getTime());
        this.setEventID(object.getEventID());
        this.setClubID(object.getClubID());
        this.setPlayerID1(object.getPlayerID1());
        this.setPlayerID2(object.getPlayerID2());
        this.setLeagueID(object.getLeagueID());
        this.setMatchID(object.getMatchID());
        this.setType(object.getType());
    }
    
    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }
        
        if (object.containsKey(ParamsKey.EVENT_ID)) {
            this.setEventID(object.getInt(ParamsKey.EVENT_ID));
        }
        
        if (object.containsKey(ParamsKey.MATCH_ID)) {
            this.setMatchID(object.getInt(ParamsKey.MATCH_ID));
        }
        
        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }
        
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        
        if (object.containsKey(ParamsKey.PLAYER_ID_1)) {
            this.setPlayerID1(object.getInt(ParamsKey.PLAYER_ID_1));
        }
        
        if (object.containsKey(ParamsKey.PLAYER_ID_2)) {
            this.setPlayerID2(object.getInt(ParamsKey.PLAYER_ID_2));
        }
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }
        
        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }
        
        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }
        
        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }
        
        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

        if (object.containsKey(ParamsKey.TIME)) {
            this.setTime(object.getInt(ParamsKey.TIME));
        }
        
    }

    
    public getEventID(): number {
        return this.eventID;
    }
    
    public setEventID(eventID: number) {
        this.eventID = eventID;
    }
    
    public getMatchID(): number {
        return this.matchID;
    }
    
    public setMatchID(matchID: number) {
        this.matchID = matchID;
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
    
    public getPlayerID1(): number {
        return this.playerID1;
    }
    
    public setPlayerID1(playerID1: number) {
        this.playerID1 = playerID1;
    }
    
    public getPlayerID2(): number {
        return this.playerID2;
    }
    
    public setPlayerID2(playerID2: number) {
        this.playerID2 = playerID2;
    }
    
    public getName():string {
        return this.name;
    }
    
    public setName(name:string) {
        this.name = name;
    }
    
    public getDescription():string {
        return this.description;
    }
    
    public setDescription(description:string) {
        this.description = description;
    }
    
    public getType(): number {
        return this.type;
    }
    
    public setType(type: number) {
        this.type = type;
    }
    
    public getState(): number {
        return this.state;
    }
    
    public setState(state: number) {
        this.state = state;
    }
    
    public getTime(): number {
        return this.time;
    }
    
    public setTime(time: number) {
        this.time = time;
    }
    
    public getTimeCreated(): number {
        return this.timeCreated;
    }
    
    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}