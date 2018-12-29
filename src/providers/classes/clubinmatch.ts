import { ParamsKey } from "./paramkeys";

export class ClubInMatch {
    
    private clubID: number = -1;
    
    private leagueID: number = -1;
    
    private matchID: number = -1;
    
    private name: string = "";
    
    private logo: string = "";
    
    private goal: number = 0;
    
    private role: number = -1;
    
    private redCard: number = 0;
    
    private yellowCard: number = 0;
    
    private players: string = "";
    
    private substitutes: string = "";
    
    private strategy: string = "";
    
    private map: string = "";
    
    private timeCreated: number = 0;

    private submitState: number = 0;
    
    public constructor (){}
    
    public getPlayersInMatch(): Array<number>{
        if(this.players.trim() == "")return [];
        let arrayID = this.players.split("-");
        let res = [];
        arrayID.forEach(element => {
            res.push(parseInt(element));
        });
        return res;
    }

    fromObject(object : ClubInMatch){
        this.setName(object.getName());
        this.setClubID(object.getClubID());
        this.setLeagueID(object.getLeagueID());
        this.setLogo(object.getLogo());
        this.setMatchID(object.getMatchID());
    }
    
    // public toSFSObject(): ISFSObject {
    //     let obj: ISFSObject = new SFSObject();
    //     obj.putInt(ParamsKey.CLUB_ID, this.getClubID());
    //     obj.putInt(ParamsKey.LEAGUE_ID, this.getLeagueID());
    //     obj.putInt(ParamsKey.MATCH_ID, this.getMatchID());
    //     obj.putUtfString(ParamsKey.NAME, this.getName());
    //     obj.putUtfString(ParamsKey.LOGO, this.getLogo());
    //     obj.putInt(ParamsKey.GOAL, this.getGoal());
    //     obj.putInt(ParamsKey.ROLE, this.getRole());
    //     obj.putInt(ParamsKey.RED_CARD, this.getRedCard());
    //     obj.putInt(ParamsKey.YELLOW_CARD, this.getYellowCard());
    //     obj.putUtfString(ParamsKey.PLAYERS, this.getPlayers());
    //     obj.putUtfString(ParamsKey.SUBSTITUES, this.getSubstitutes());
    //     obj.putUtfString(ParamsKey.STRATEGY, this.getStrategy());
    //     obj.putUtfString(ParamsKey.MAP, this.getMap());
    //     obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
    //     return obj;
    // }
    
    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }
        
        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }
        
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        
        if (object.containsKey(ParamsKey.MATCH_ID)) {
            this.setMatchID(object.getInt(ParamsKey.MATCH_ID));
        }
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }
        
        if (object.containsKey(ParamsKey.LOGO)) {
            this.setLogo(object.getUtfString(ParamsKey.LOGO));
        }
        
        if (object.containsKey(ParamsKey.GOAL)) {
            this.setGoal(object.getInt(ParamsKey.GOAL));
        }
        
        if (object.containsKey(ParamsKey.ROLE)) {
            this.setRole(object.getInt(ParamsKey.ROLE));
        }
        
        if (object.containsKey(ParamsKey.RED_CARD)) {
            this.setRedCard(object.getInt(ParamsKey.RED_CARD));
        }
        
        if (object.containsKey(ParamsKey.YELLOW_CARD)) {
            this.setYellowCard(object.getInt(ParamsKey.YELLOW_CARD));
        }
        
        if (object.containsKey(ParamsKey.PLAYERS)) {
            this.setPlayers(object.getUtfString(ParamsKey.PLAYERS));
        }
        
        if (object.containsKey(ParamsKey.SUBSTITUES)) {
            this.setSubstitutes(object.getUtfString(ParamsKey.SUBSTITUES));
        }
        
        if (object.containsKey(ParamsKey.STRATEGY)) {
            this.setStrategy(object.getUtfString(ParamsKey.STRATEGY));
        }
        
        if (object.containsKey(ParamsKey.MAP)) {
            this.setMap(object.getUtfString(ParamsKey.MAP));
        }
        
        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

        if(object.containsKey(ParamsKey.SUBMIT_STATE)){
            this.setSubmitState(object.getInt(ParamsKey.SUBMIT_STATE));
        }
        
    }
    
    public setSubmitState(state : number){
        this.submitState = state;
    }
    
    public getSubmitState() : number{
        return this.submitState;
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
    
    public getMatchID(): number {
        return this.matchID;
    }
    
    public setMatchID(matchID: number) {
        this.matchID = matchID;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public setName(name: string) {
        this.name = name;
    }
    
    public getLogo(): string {
        return this.logo;
    }
    
    public setLogo(logo: string) {
        this.logo = logo;
    }
    
    public getGoal(): number {
        return this.goal;
    }
    
    public setGoal(goal: number) {
        this.goal = goal;
    }
    
    public getRole(): number {
        return this.role;
    }
    
    public setRole(role: number) {
        this.role = role;
    }
    
    public getRedCard(): number {
        return this.redCard;
    }
    
    public setRedCard(redCard: number) {
        this.redCard = redCard;
    }
    
    public getYellowCard(): number {
        return this.yellowCard;
    }
    
    public setYellowCard(yellowCard: number) {
        this.yellowCard = yellowCard;
    }
    
    public getPlayers(): string {
        return this.players;
    }
    
    public setPlayers(players: string) {
        this.players = players;
    }
    
    public getSubstitutes(): string {
        return this.substitutes;
    }
    
    public setSubstitutes(substitutes: string) {
        this.substitutes = substitutes;
    }
    
    public getStrategy(): string {
        return this.strategy;
    }
    
    public setStrategy(strategy: string) {
        this.strategy = strategy;
    }
    
    public getMap(): string {
        return this.map;
    }
    
    public setMap(map: string) {
        this.map = map;
    }
    
    public getTimeCreated(): number {
        return this.timeCreated;
    }
    
    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}