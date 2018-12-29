import { ParamsKey } from "./paramkeys";

export class JoinLeagueRequest {
    
    public requestID: number = -1;
    
    private clubID: number = -1;
    
    private leagueID: number = -1;

    private leaderID: number = -1;
    
    private showman: string = "";
    
    private state: number = -1;
    
    private type: number = -1;
    
    private timeCreated: number = 0;

    private clubName: string = "";

    private clubLogo: string = "";
    
    constructor(){}
    
    
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
        
        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

        if(object.containsKey(ParamsKey.LEADER_ID)){
            this.setLeaderID(object.getInt(ParamsKey.LEADER_ID));
        }

        if(object.containsKey(ParamsKey.SHOWMAN)){
            this.setShowman(object.getUtfString(ParamsKey.SHOWMAN));
        }

        if(object.containsKey(ParamsKey.NAME)){
            this.setClubName(object.getUtfString(ParamsKey.NAME));
        }
        if(object.containsKey(ParamsKey.LOGO)){
            this.setClubLogo(object.getUtfString(ParamsKey.LOGO));
        }
        
    }

    public getClubName(): string {
        return this.clubName;
    }
    
    public setClubName(name: string) {
        this.clubName = name;
    }

    public getClubLogo(): string {
        return this.clubLogo;
    }
    
    public setClubLogo(logo: string) {
        this.clubLogo = logo;
    }


    public getShowman(): string {
        return this.showman;
    }
    
    public setShowman(showman: string) {
        this.showman = showman;
    }

    public getLeaderID(): number {
        return this.leaderID;
    }
    
    public setLeaderID(leaderID: number) {
        this.leaderID = leaderID;
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
    
    public getTimeCreated(): number {
        return this.timeCreated;
    }
    
    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}