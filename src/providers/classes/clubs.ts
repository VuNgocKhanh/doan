import { ParamsKey } from "./paramkeys";
import { Player } from "./player";
import { User } from "./user";
import { RoleInClub } from "../manager/constant-manager";
import { ClubInLeague } from "./clubinleague";

export class ManagerClub{
    private name: string = "";
    private managerID: number = -1;
    private avatar : string = "";

    constructor(){}

    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }
        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setManagerID(object.getInt(ParamsKey.USER_ID));
        }
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.AVATAR)) {
            this.setAvatar(object.getUtfString(ParamsKey.AVATAR));
        }
    }

    public getManagerID(): number {
        return this.managerID;
    }
    
    public setManagerID(id: number) {
        this.managerID = id;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public setName(name: string) {
        this.name = name;
    }
    
    public getAvatar(): string {
        return this.avatar;
    }
    
    public setAvatar(ava: string) {
        this.avatar = ava;
    }
    

}

export class Clubs {

    public clubID: number = -1;
    
    public name: string = "";
    
    public slogan: string = "";
    
    public logo: string = "";
    
    public description: string = "";
    
    public cover: string = "";
    
    public state: number = -1;
    
    public numberPlayer: number = 1;

    public shirtColor: string = "";
    
    public timeCreated: number = 0;

    public mListPlayer: Array<Player> = [];

    public mListRequestPlayer: Array<User> = [];

    public roleOfUser : number = RoleInClub.GUEST;

    public numberLeague : number = 0;

    public numberRequestJoin : number = 0;

    private managerID: number = -1;
    
    public manager: ManagerClub = new ManagerClub();

    constructor() {
    }

    public getManagerID(): number {
        return this.managerID;
    }
    
    public setManagerID(id: number) {
        this.managerID = id;
    }

    public setManager(manager: ManagerClub){
        this.manager = manager;
    }

    public getManager(): ManagerClub{
        return this.manager;
    }

    public fromObject(object: Clubs){
        if(object == null || object == undefined) return;
        this.setClubID(object.getClubID());
        this.setName(object.getName());
        this.setLogo(object.getLogo());
        this.setDescription(object.getDescription());
        this.setSlogan(object.getSlogan());
        this.setNumberPlayer(object.getNumberPlayer());
        this.setCover(object.getCover());
        this.setState(object.getState());
        this.setState(object.getState());
        this.setRoleOfUser(object.getRoleOfUser());
        this.setTimeCreated(object.getTimeCreated());
        this.setShirtColor(object.getShirtColor());
    }


    fromClubInLeague(club: ClubInLeague){
        this.setClubID(club.getClubID());
        this.setName(club.getName());
        this.setLogo(club.getLogo());
    }

    public setRoleOfUser(role: number){
        this.roleOfUser = role;
    }

    public getRoleOfUser(): number{
        return this.roleOfUser;
    }

    setListPlayer(listPlayer: Array<Player>){
        this.mListPlayer = listPlayer;
    }

    getListPlayer(): Array<Player>{
        return this.mListPlayer;
    }

    setListRequestPlayer(listRequest: Array<User>){
        this.mListRequestPlayer = listRequest;
    }

    getListRequestPlayer(): Array<User>{
        return this.mListRequestPlayer;
    }

     
    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }

        if(object.containsKey(ParamsKey.MANAGER)){
            this.manager.fromSFSobject(object.getSFSObject(ParamsKey.MANAGER));
        }

        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }

        if (object.containsKey(ParamsKey.MANAGER_ID)) {
            this.setManagerID(object.getInt(ParamsKey.MANAGER_ID));
            this.getManager().setManagerID(this.managerID);
        }
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.CLUB_NAME)) {
            this.setName(object.getUtfString(ParamsKey.CLUB_NAME));
        }
        
        if (object.containsKey(ParamsKey.SLOGAN)) {
            this.setSlogan(object.getUtfString(ParamsKey.SLOGAN));
        }

        if (object.containsKey(ParamsKey.LOGO)) {
            this.setLogo(object.getUtfString(ParamsKey.LOGO));
        }

        if (object.containsKey("club_logo")) {
            this.setLogo(object.getUtfString("club_logo"));
        }
        
        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }
        
        if (object.containsKey(ParamsKey.COVER)) {
            this.setCover(object.getUtfString(ParamsKey.COVER));
        }
        
        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }
        
        if (object.containsKey(ParamsKey.SHIRT_COLOR)) {
            this.setShirtColor(object.getUtfString(ParamsKey.SHIRT_COLOR));
        }
        
        if (object.containsKey(ParamsKey.NUMBER_PLAYER)) {
            this.setNumberPlayer(object.getInt(ParamsKey.NUMBER_PLAYER));
        }
        
        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

        if (object.containsKey(ParamsKey.ROLE)) {
            this.setRoleOfUser(object.getInt(ParamsKey.ROLE));
        }
    }

    public getClubID(): number {
        return this.clubID;
    }
    
    public setClubID(clubID: number) {
        this.clubID = clubID;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public setName(name: string) {
        this.name = name;
    }
    
    public getSlogan(): string {
        return this.slogan;
    }
    
    public setSlogan(slogan: string) {
        this.slogan = slogan;
    }
    
    public getLogo(): string {
        return this.logo;
    }
    
    public setLogo(logo: string) {
        this.logo = logo;
    }
    
    public getDescription(): string {
        return this.description;
    }
    
    public setDescription(description: string) {
        this.description = description;
    }
    
    public getCover(): string {
        return this.cover;
    }
    
    public setCover(cover: string) {
        this.cover = cover;
    }
    
    public getState(): number {
        return this.state;
    }
    
    public setState(state: number) {
        this.state = state;
    }
    
    public getNumberPlayer(): number {
        return this.numberPlayer;
    }
    
    public setNumberPlayer(numberPlayer: number) {
        this.numberPlayer = numberPlayer;
    }
    
    public getShirtColor(): string {
        return this.shirtColor;
    }
    
    public setShirtColor(shirtColor: string) {
        this.shirtColor = shirtColor;
    }
    
    public getTimeCreated(): number {
        return this.timeCreated;
    }
    
    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}