import { ParamsKey } from "./paramkeys";
import { JoinLeagueRequest } from "./joinleaguerequest";
import { Clubs } from "./clubs";

export class ClubInLeague  extends Clubs{
    private leagueName : string = "";

    private leagueID: number = -1;

    private leaderID: number = -1;

    private showMan : string  = "";
    
    private groupID: number = -1;
    
    private won: number = 0;
    
    private drawn: number = 0;
    
    private lost: number = 0;
    
    private goalsFor: number = 0;
    
    private goalsAgainst: number = 0;
    
    private yellowCardNumber: number = 0;
    
    private redCardNumber: number = 0;
    
    private played: number = 0;
    
    private points: number = 0;

    private hotline: string = "";

    private email: string = "";

    private position: number = 0;

    constructor (){
        super();
    }

    fromClubs(club: Clubs){
        this.setClubID(club.getClubID());
        this.setNumberPlayer(club.getNumberPlayer());
        this.setManager(club.getManager());
        this.setName(club.getName());
        this.setLogo(club.getLogo());
        this.setSlogan(club.getSlogan());
        this.setCover(club.getCover());
    }

    fromJoinLeagueRequest(object: JoinLeagueRequest){
        this.setLeagueID(object.getLeagueID());
        this.setLeaderID(object.getLeaderID());
        this.setShowman(object.getShowman());
        this.setLogo(object.getClubLogo());
        this.setName(object.getClubName());
        this.setClubID(object.getClubID());
    }
    

    onResponseUserManageClubInLeague(object: any) {
        if(!object) return;
        
        super.fromSFSobject(object.getSFSObject(ParamsKey.CLUB));
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setLeagueName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        
    }



    onFromSFSobject(object: any) {
        super.fromSFSobject(object);
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setLeagueName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        
        if (object.containsKey(ParamsKey.GROUP_ID)) {
            this.setGroupID(object.getInt(ParamsKey.GROUP_ID));
        }
        
        if (object.containsKey(ParamsKey.WON)) {
            this.setWon(object.getInt(ParamsKey.WON));
        }
        
        if (object.containsKey(ParamsKey.DRAWN)) {
            this.setDrawn(object.getInt(ParamsKey.DRAWN));
        }
        
        if (object.containsKey(ParamsKey.LOST)) {
            this.setLost(object.getInt(ParamsKey.LOST));
        }
        
        if (object.containsKey(ParamsKey.GOALS_FOR)) {
            this.setGoalsFor(object.getInt(ParamsKey.GOALS_FOR));
        }
        
        if (object.containsKey(ParamsKey.GOALS_AGAINST)) {
            this.setGoalsAgainst(object.getInt(ParamsKey.GOALS_AGAINST));
        }
        
        if (object.containsKey(ParamsKey.YELLOW_CARD_NUMBER)) {
            this.setYellowCardNumber(object.getInt(ParamsKey.YELLOW_CARD_NUMBER));
        }
        
        if (object.containsKey(ParamsKey.RED_CARD_NUMBER)) {
            this.setRedCardNumber(object.getInt(ParamsKey.RED_CARD_NUMBER));
        }
        
        if (object.containsKey(ParamsKey.PLAYED)) {
            this.setPlayed(object.getInt(ParamsKey.PLAYED));
        }
        
        if (object.containsKey(ParamsKey.POINTS)) {
            this.setPoints(object.getInt(ParamsKey.POINTS));
        }
        
        if(object.containsKey(ParamsKey.LEADER_ID)){
            this.setLeaderID(object.getInt(ParamsKey.LEADER_ID));
        }

        if(object.containsKey(ParamsKey.SHOWMAN)){
            this.setShowman(object.getUtfString(ParamsKey.SHOWMAN));
        }
        if(object.containsKey(ParamsKey.HOTLINE)){
            this.setHotline(object.getUtfString(ParamsKey.HOTLINE));
        }
        if(object.containsKey(ParamsKey.EMAIL)){
            this.setEmail(object.getUtfString(ParamsKey.EMAIL));
        }

        if(object.containsKey(ParamsKey.POSITION)){
            this.setPosition(object.getInt(ParamsKey.POSITION));
        }
    }

    public setLeagueName(leagueName: string){
        this.leagueName = leagueName;
    }

    public getLeagueName(): string{
        return this.leagueName;
    }
   
    public getPosition(): number {
        return this.position;
    }
    
    public setPosition(postion: number) {
        this.position = postion;
    } 

    public getHotline(): string {
        return this.hotline;
    }
    
    public setHotline(showman: string) {
        this.hotline = showman;
    }
    public getEmail(): string {
        return this.email;
    }
    
    public setEmail(showman: string) {
        this.email = showman;
    }

    public getShowman(): string {
        return this.showMan;
    }
    
    public setShowman(showman: string) {
        this.showMan = showman;
    }

    public getLeaderID(): number {
        return this.leaderID;
    }
    
    public setLeaderID(leaderID: number) {
        this.leaderID = leaderID;
    }
    
    
    public getLeagueID(): number {
        return this.leagueID;
    }
    
    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }
    
    public getGroupID(): number {
        return this.groupID;
    }
    
    public setGroupID(groupID: number) {
        this.groupID = groupID;
    }
    
    public getWon(): number {
        return this.won;
    }
    
    public setWon(won: number) {
        this.won = won;
    }
    
    public getDrawn(): number {
        return this.drawn;
    }
    
    public setDrawn(drawn: number) {
        this.drawn = drawn;
    }
    
    public getLost(): number {
        return this.lost;
    }
    
    public setLost(lost: number) {
        this.lost = lost;
    }
    
    public getGoalsFor(): number {
        return this.goalsFor;
    }
    
    public setGoalsFor(goalsFor: number) {
        this.goalsFor = goalsFor;
    }
    
    public getGoalsAgainst(): number {
        return this.goalsAgainst;
    }
    
    public setGoalsAgainst(goalsAgainst: number) {
        this.goalsAgainst = goalsAgainst;
    }
    
    public getYellowCardNumber(): number {
        return this.yellowCardNumber;
    }
    
    public setYellowCardNumber(yellowCardNumber: number) {
        this.yellowCardNumber = yellowCardNumber;
    }
    
    public getRedCardNumber(): number {
        return this.redCardNumber;
    }
    
    public setRedCardNumber(redCardNumber: number) {
        this.redCardNumber = redCardNumber;
    }
    
    public getPlayed(): number {
        return this.played;
    }
    
    public setPlayed(played: number) {
        this.played = played;
    }
    
    public getPoints(): number {
        return this.points;
    }
    
    public setPoints(points: number) {
        this.points = points;
    }
}