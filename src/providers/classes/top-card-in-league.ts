import { ParamsKey } from "./paramkeys";
import { Utils } from "../core/app/utils";

export class TopCardInLeague{
    private playerID : number = -1;
    
    private yellow_card : number = 0;

    private red_card : number = 0;

    private club_logo : string = "";

    private clubID : number = -1;

    private player_name : string = "";

    private avatar : string = "";

    private club_name : string = "";

    private leagueID : number = -1;


    onResponeSFSObject(object: any){
      
        if (object.containsKey(ParamsKey.PLAYER_ID)) {
            this.setPlayerID(object.getInt(ParamsKey.PLAYER_ID));
        }
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }

        if (object.containsKey(ParamsKey.YELLOW_CARD)) {
            this.setYellowCard(object.getInt(ParamsKey.YELLOW_CARD));
        }

        if (object.containsKey(ParamsKey.RED_CARD)) {
            this.setRedCard(object.getInt(ParamsKey.RED_CARD));
        }
       
        if (object.containsKey(ParamsKey.AVATAR)) {
            this.setAvatar(object.getUtfString(ParamsKey.AVATAR));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setPlayerName(object.getUtfString(ParamsKey.NAME));
        }

        if(object.containsKey("club_logo")){
            this.setClubLogo(object.getUtfString("club_logo"));
        }

        if (object.containsKey(ParamsKey.CLUB_NAME)) {
            this.setClubName(object.getUtfString(ParamsKey.CLUB_NAME));
        }

    }

    public getAvatar(): string {
        return this.avatar;
    }

    public setAvatar(avatar: string) {
        this.avatar = avatar;
    }

    public getPlayerID(): number{
        return this.playerID;
    }

    public setPlayerID(playerID: number){
        this.playerID = playerID;
    }

    public getLeagueID(): number{
        return this.leagueID;
    }
    
    public setLeagueID(leagueID: number){
        this.leagueID = leagueID;
    }

    public getClubID(): number{
        return this.clubID;
    }

    public setClubID(clubID: number){
        this.clubID = clubID;
    }

    public getPlayerName(): string {
        return this.player_name;
    }

    public setPlayerName(player_name: string) {
        this.player_name = player_name;
    }
    
    public getClubLogo(): string {
        return this.club_logo;
    }

    public setClubLogo(club_logo: string) {
        this.club_logo = club_logo;
    }

    public getClubName(): string {
        return this.club_name;
    }

    public setClubName(club_name: string) {
        this.club_name = club_name;
    }

    public getYellowCard(): number {
        return this.yellow_card;
    }

    public setYellowCard(yellow_card: number) {
        this.yellow_card = yellow_card;
    }

    public getRedCard(): number {
        return this.red_card;
    }

    public setRedCard(red_card: number) {
        this.red_card = red_card;
    }
}