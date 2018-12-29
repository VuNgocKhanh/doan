import { ParamsKey } from "./paramkeys";

export class Referee {
    
    private refereeID: number = -1;
    
    private name: string = "";
    
    private avatar: string = "";
    
    private phone: string = "";
    
    private type: number = 0;
    
    private state: number = 0;
    
    private userRole: number = 0;

    private refereeRole: number = -1;
    
    private numberMatch: number = 0;
    
    private numberLeague: number = 0;
    
    private timeCreated: number = 0;
    
    public constructor () {}
   
    
    // public toSFSObject(): ISFSObject {
    //     let obj: ISFSObject = new SFSObject();
    //     obj.putInt(ParamsKey.REFEREE_ID, this.getRefereeID());
    //     obj.putUtfString(ParamsKey.NAME, this.getName());
    //     obj.putUtfString(ParamsKey.AVATAR, this.getAvatar());
    //     obj.putUtfString(ParamsKey.COVER, this.getCover());
    //     obj.putUtfString(ParamsKey.PHONE, this.getPhone());
    //     obj.putInt(ParamsKey.TYPE, this.getType());
    //     obj.putInt(ParamsKey.STATE, this.getState());
    //     obj.putInt(ParamsKey.ROLE, this.getRole());
    //     obj.putInt(ParamsKey.NUMBER_MATCH, this.getNumberMatch());
    //     obj.putInt(ParamsKey.NUMBER_LEAGUE, this.getNumberLeague());
    //     obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
    //     return obj;
    // }
    
    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.REFEREE_ID)) {
            this.setRefereeID(object.getInt(ParamsKey.REFEREE_ID));
        }
        if (object.containsKey(ParamsKey.USER_ROLE)) {
            this.setUserRole(object.getInt(ParamsKey.USER_ROLE));
        }
        if (object.containsKey(ParamsKey.REFEREE_ROLE)) {
            this.setRefereeRole(object.getInt(ParamsKey.REFEREE_ROLE));
        }
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }
        
        if (object.containsKey(ParamsKey.AVATAR)) {
            this.setAvatar(object.getUtfString(ParamsKey.AVATAR));
        }
        
        
        if (object.containsKey(ParamsKey.PHONE)) {
            this.setPhone(object.getUtfString(ParamsKey.PHONE));
        }
        
        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }
        
        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }
        
        
        if (object.containsKey(ParamsKey.NUMBER_MATCH)) {
            this.setNumberMatch(object.getInt(ParamsKey.NUMBER_MATCH));
        }
        
        if (object.containsKey(ParamsKey.NUMBER_LEAGUE)) {
            this.setNumberLeague(object.getInt(ParamsKey.NUMBER_LEAGUE));
        }
        
        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }
        
    }
    
    public getUserRole(): number {
        return this.userRole;
    }
    
    public setUserRole(refereeID: number) {
        this.userRole  = refereeID;
    }
    
    public getRefereeRole(): number {
        return this.refereeRole;
    }
    
    public setRefereeRole(refereeID: number) {
        this.refereeRole =refereeID;
    }
    public getRefereeID(): number {
        return this.refereeID;
    }
    
    public setRefereeID(refereeID: number) {
        this.refereeID =refereeID;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public setName(name: string) {
        this.name =name;
    }
    
    public getAvatar(): string {
        return this.avatar;
    }
    
    public setAvatar(avatar: string) {
        this.avatar = avatar;
    }
    
    
    public getPhone(): string {
        return this.phone;
    }
    
    public setPhone(phone: string) {
        this.phone =phone;
    }
    
    public getType(): number {
        return this.type;
    }
    
    public setType(type: number) {
        this.type =type;
    }
    
    public getState(): number {
        return this.state;
    }
    
    public setState(state: number) {
        this.state =state;
    }
    
    
    public getNumberMatch(): number {
        return this.numberMatch;
    }
    
    public setNumberMatch(numberMatch: number) {
        this.numberMatch =numberMatch;
    }
    
    public getNumberLeague(): number {
        return this.numberLeague;
    }
    
    public setNumberLeague(numberLeague: number) {
        this.numberLeague =numberLeague;
    }
    
    public getTimeCreated(): number {
        return this.timeCreated;
    }
    
    public setTimeCreated(timeCreated: number) {
        this.timeCreated =timeCreated;
    }
}

export class RefereInLeague extends Referee{

    private numberMatchInLeague: number = 0;
    private leagueID: number = -1;

    constructor(){
        super();
    }

    public fromObject(referee: Referee){
        this.setRefereeID(referee.getRefereeID());
        this.setName(referee.getName());
        this.setAvatar(referee.getAvatar());
        this.setNumberMatch(referee.getNumberMatch());
        this.setNumberLeague(referee.getNumberLeague());
        this.setPhone(referee.getPhone());
        this.setState(referee.getState());
    }

    public fromSFSObject(object: any) {
        super.fromSFSObject(object);
        if(object == null)return;
        
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        
        if (object.containsKey(ParamsKey.NUMBER_MATCH)) {
            this.setNumberMatchInLeague(object.getInt(ParamsKey.NUMBER_MATCH));
        }
        
    }

    public setLeagueID(leagueID: number){
        this.leagueID = leagueID;
    }

    public getLeagueID(): number{
        return this.leagueID;
    }

    public setNumberMatchInLeague(numbermatch: number){
        this.numberMatchInLeague = numbermatch;
    }

    public getNumberMatchInLeague(): number{
        return this.numberMatchInLeague;
    }

}

export class RefereeInMatch extends Referee{
    private leagueID: number = -1;
    private matchID: number = -1;
    constructor(){
        super();
    }

    fromRefereeInLeague(referee: RefereInLeague){
        this.setRefereeID(referee.getRefereeID());
        this.setName(referee.getName());
        this.setAvatar(referee.getAvatar());
        this.setLeagueID(referee.getLeagueID());
        this.setType(referee.getType());
    }

    fromRefereeInMatch(referee: RefereeInMatch){
        this.setRefereeID(referee.getRefereeID());
        this.setName(referee.getName());
        this.setAvatar(referee.getAvatar());
        this.setLeagueID(referee.getLeagueID());
        this.setType(referee.getType());
        this.setRefereeRole(referee.getRefereeRole());
    }

    fromSFSObject(object){
        super.fromSFSObject(object);
         
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
         
        if (object.containsKey(ParamsKey.MATCH_ID)) {
            this.setMatchID(object.getInt(ParamsKey.MATCH_ID));
        }

        if (object.containsKey(ParamsKey.ROLE)) {
            this.setRefereeRole(object.getInt(ParamsKey.ROLE));
        }

    }

    
    public setLeagueID(leagueID: number){
        this.leagueID = leagueID;
    }

    public getLeagueID(): number{
        return this.leagueID;
    }

    public getMatchID(): number {
        return this.matchID;
    }

    public setMatchID(matchID: number) {
        this.matchID = matchID;
    }
}