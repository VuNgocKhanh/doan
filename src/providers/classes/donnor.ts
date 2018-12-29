import { ParamsKey } from "./paramkeys";

export class Dornor {
    
    private dornorID: number = -1;

    private name: string = "";
    
    private description: string = "";
    
    private logo: string = "";
    
    private cover: string = "";
    
    private state: number = 0;
    
    private website: string = "";
    
    private facebook: string = "";
    
    private youtube: string = "";
    
    private timeCreated: number = 0;

    private numberLeague: number = 0;
    
    constructor(){}

    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }
        
        if (object.containsKey(ParamsKey.DORNOR_ID)) {
            this.setDornorID(object.getInt(ParamsKey.DORNOR_ID));
        }

        if (object.containsKey(ParamsKey.NUMBER_LEAGUE)) {
            this.setNumberLeague(object.getInt(ParamsKey.NUMBER_LEAGUE));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }
        
        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }
        
        if (object.containsKey(ParamsKey.LOGO)) {
            this.setLogo(object.getUtfString(ParamsKey.LOGO));
        }
        
        if (object.containsKey(ParamsKey.COVER)) {
            this.setCover(object.getUtfString(ParamsKey.COVER));
        }
        
        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }
        
        if (object.containsKey(ParamsKey.WEBSITE)) {
            this.setWebsite(object.getUtfString(ParamsKey.WEBSITE));
        }
        
        if (object.containsKey(ParamsKey.FACEBOOK)) {
            this.setFacebook(object.getUtfString(ParamsKey.FACEBOOK));
        }
        
        if (object.containsKey(ParamsKey.YOUTUBE)) {
            this.setYoutube(object.getUtfString(ParamsKey.YOUTUBE));
        }
        
        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }
        
    }

    public getNumberLeague(): number {
        return this.numberLeague;
    }
    
    public setNumberLeague(league: number) {
        this.numberLeague = league;
    }
    
    
    public getDornorID(): number {
        return this.dornorID;
    }
    
    public setDornorID(dornorID: number) {
        this.dornorID = dornorID;
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
    
    public setDescription(description: string) {
        this.description = description;
    }
    
    public getLogo(): string {
        return this.logo;
    }
    
    public setLogo(logo: string) {
        this.logo = logo;
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
    
    public getWebsite(): string {
        return this.website;
    }
    
    public setWebsite(website: string) {
        this.website = website;
    }
    
    public getFacebook(): string {
        return this.facebook;
    }
    
    public setFacebook(facebook: string) {
        this.facebook = facebook;
    }
    
    public getYoutube(): string {
        return this.youtube;
    }
    
    public setYoutube(youtube: string) {
        this.youtube = youtube;
    }
    
    public getTimeCreated(): number {
        return this.timeCreated;
    }
    
    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}



export class DornorInLeague extends Dornor{
    private leagueID: number = -1;
    private priority: number = -1;

    constructor(){
        super();
    }

    public fromObject(dornor: Dornor){
        this.setDornorID(dornor.getDornorID());
        this.setName(dornor.getName());
        this.setLogo(dornor.getLogo());
        this.setNumberLeague(dornor.getNumberLeague());

    }

    public fromSFSObject(object: any) {
        super.fromSFSobject(object);
        if(object == null)return;
        
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        if (object.containsKey(ParamsKey.PRIORITY)) {
            this.setPriority(object.getInt(ParamsKey.PRIORITY));
        }      
    }

    public setLeagueID(leagueID: number){
        this.leagueID = leagueID;
    }

    public getLeagueID(): number{
        return this.leagueID;
    }

    public setPriority(priority: number){
        this.priority = priority;
    }

    public getPriority(): number{
        return this.priority;
    }
}