import { ParamsKey } from "./paramkeys";
import { PlayerRecordState } from "../manager/constant-manager";
import { FormModel } from "../../pages/profile-user/profile-user";
import { RecordItems } from "./recorditem";
import { Utils } from "../core/app/utils";
import { CalendarDate } from "../core/calendar/calendar-date";
import { Clubs } from "./clubs";

export class PlayerRecordInLeague {

    private leagueID: number = -1;

    private playerID: number = -1;

    private clubID: number = -1;

    private state: number = PlayerRecordState.CREATED;

    private missing_items: string = "";

    private fail_items: string = "";

    private message: string = "";

    private data: string = "";

    private mDatas: {
        data: Array<FormModel>
        avatar: "",
        imageCMNDForce: "",
        imageCMNDBack: ""
    } = null;

    private leagueName: string = "";

    private club: Clubs = new Clubs();

    private playerName: string = "";

    private playerAvatar: string = "";

    private playerBirthday: number = -1;

    constructor() { }

    // public toSFSobject(): ISFSobject {
    //     let obj: ISFSobject = new SFSobject();
    //     obj.putInt(ParamsKey.LEAGUE_ID, this.getLeagueID());
    //     obj.putInt(ParamsKey.PLAYER_ID, this.getPlayerID());
    //     obj.putInt(ParamsKey.CLUB_ID, this.getClubID());
    //     obj.putInt(ParamsKey.STATE, this.getState());
    //     obj.putUtfstring(ParamsKey.MISSING_ITEMS, this.getMissing_items());
    //     obj.putUtfstring(ParamsKey.FAIL_ITEMS, this.getFail_items());
    //     obj.putUtfstring(ParamsKey.MESSAGE, this.getMessage());
    //     obj.putUtfstring(ParamsKey.DATA, this.getData());
    //     return obj;
    // }

    public getMDatas(){
        return this.mDatas;
    }

    public setMDatas(mdatas: any){
        this.mDatas = mdatas;
        this.mDatas.data.forEach(element => {
            let newRecordItems = new RecordItems();
            newRecordItems.fromObject(element.item);
            element.item = newRecordItems;
        });
    }

    public getNamePlayerInForm(): string{
        if(this.getMDatas() == null) return "";
        let listForm = this.getMDatas().data;

        if(listForm.length > 0){    
            for(let form of listForm){
                if(form.item.getType() == 1){
                    return form.value;
                }
            }
            return "";
        }else{
            return "";
        }
    }

    public getBirthDay(): number{
        if(this.getMDatas() == null) return -1;
        let listForm = this.getMDatas().data;

        if(listForm.length > 0){    
            for(let form of listForm){
                if(form.item.getType() == 10){
                    let dateString = form.value;
                    let newCalendardate = new CalendarDate();
                    newCalendardate.setDateFromString(dateString);
                    return new Date(Utils.getRequestDateFromDDMMYY(newCalendardate.dd,newCalendardate.mm,newCalendardate.yy)).getTime();
                }
            }
            return -1;
        }else{
            return -1;
        }
    }

    public getAvatarPlayerInForm(): string{
        if(this.getMDatas() == null) return "";
        return this.getMDatas().avatar;
    }

    public getPlayerPositionID(): number{
        if(this.getMDatas() == null) return -1;
        let listForm = this.getMDatas().data;

        if(listForm.length > 0){    
            for(let form of listForm){
                if(form.item.getType() == 5){
                    return parseInt(form.value);
                }
            }
            return -1;
        }else{
            return -1;
        }
    }

    public getShirtNumber(): number{
        if(this.getMDatas() == null) return -1;
        let listForm = this.getMDatas().data;

        if(listForm.length > 0){    
            for(let form of listForm){
                if(form.item.getType() == 6){
                    return parseInt(form.value);
                }
            }
            return -1;
        }else{
            return -1;
        }
    }



    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }

        if (object.containsKey(ParamsKey.PLAYER_ID)) {
            this.setPlayerID(object.getInt(ParamsKey.PLAYER_ID));
        }

        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.MISSING_ITEMS)) {
            this.setMissing_items(object.getUtfString(ParamsKey.MISSING_ITEMS));
        }

        if (object.containsKey(ParamsKey.FAIL_ITEMS)) {
            this.setFail_items(object.getUtfString(ParamsKey.FAIL_ITEMS));
        }

        if (object.containsKey(ParamsKey.MESSAGE)) {
            this.setMessage(object.getUtfString(ParamsKey.MESSAGE));
        }

        if (object.containsKey(ParamsKey.DATA)) {
            this.setData(object.getUtfString(ParamsKey.DATA));
        }

        if (object.containsKey(ParamsKey.LEAGUE_NAME)) {
            this.setLeagueName(object.getUtfString(ParamsKey.LEAGUE_NAME));
        }

        if(object.containsKey(ParamsKey.AVATAR)){
            this.setPlayerAvatar(object.getUtfString(ParamsKey.AVATAR));
        }

        if(object.containsKey(ParamsKey.CLUB)){
            this.getClub().fromSFSobject(object.getSFSObject(ParamsKey.CLUB));
        }

        if(object.containsKey(ParamsKey.NAME)){
            this.setPlayerName(object.getUtfString(ParamsKey.NAME));
        }

        if(object.containsKey(ParamsKey.BIRTHDAY)){
            this.setPlayerBirthday(object.getLong(ParamsKey.BIRTHDAY));
        }

    }

    public setPlayerBirthday(birthday: number){
        this.playerBirthday = birthday;
    }

    public getPlayerBirthday() : number{
        return this.playerBirthday;
    }

    public setPlayerName(name: string){
        this.playerName = name;
    }

    public getPlayerName() : string{
        return this.playerName;
    }

    public setPlayerAvatar(avatar: string){
        this.playerAvatar = avatar;
    }

    public getPlayerAvatar(): string{
        return this.playerAvatar;
    }

    public getClub(): Clubs{
        return this.club;
    }

    setLeagueName(leagueName: string){
        this.leagueName = leagueName;
    }
    getLeagueName(): string{
        return this.leagueName ;
    }

    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
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

    public getMissing_items(): string {
        return this.missing_items;
    }

    public setMissing_items(missing_items: string) {
        this.missing_items = missing_items;
    }

    public getFail_items(): string {
        return this.fail_items;
    }

    public setFail_items(fail_items: string) {
        this.fail_items = fail_items;
    }

    public getMessage(): string {
        return this.message;
    }

    public setMessage(message: string) {
        this.message = message;
    }

    public getData(): string {
        return this.data;
    }

    public setData(data: string) {
        this.data = data;
        if(this.data.trim() != ""){
            this.setMDatas(JSON.parse(this.data));
        }
    }
}