import { ParamsKey } from "./paramkeys";
import { FormModel } from "../../pages/profile-user/profile-user";
import { RecordItems } from "./recorditem";
import { Utils } from "../core/app/utils";
import { Player } from "./player";
import { PlayerRecordInLeague } from "./player_record_inleague";
import { IfObservable } from "rxjs/observable/IfObservable";

export class PlayerCards{
    private leagueName: string = "";
    private playerName: string= "";
    private avatar: string= "";
    private clubName: string= "";
    private birthDay: string = "";
    private state: number = 0;
    private leagueID: number = -1;
    private playerID: number = -1;
    private clubID: number = -1;

    private mDatas: {
        data: Array<FormModel>
        avatar: "",
        imageCMNDForce: "",
        imageCMNDBack: ""
    } = null;


    constructor(){}

    public getMDatas(){
        return this.mDatas;
    }

    public setMDatas(mdatas: string){
        if(!mdatas) return;
        this.mDatas = JSON.parse(mdatas);
        this.mDatas.data.forEach(element => {
            let newRecordItems = new RecordItems();
            newRecordItems.fromObject(element.item);
            element.item = newRecordItems;
        });
    }

    public onParseData(){
        if(this.mDatas == null)return;
        if(this.mDatas.avatar.trim() != ""){
            this.avatar = this.mDatas.avatar;
        }

        this.mDatas.data.forEach(form=>{
            if(form.item.getType() == 1){
                this.setPlayerName(form.value);
            }else if(form.item.getType() == 10){
                this.setBirthday(form.value);
            }
        })
    }

    public fromPlayerRecordInLeague(record: PlayerRecordInLeague){
        this.setClubName(record.getClub().getName());
        this.setLeagueName(record.getLeagueName());
        this.setPlayerID(record.getPlayerID());
        this.setClubID(record.getClub().getClubID());
        this.setLeagueID(record.getLeagueID());
        this.setState(record.getState());

        let avatar = record.getAvatarPlayerInForm();
        if(avatar.trim() != ""){
            this.setAvatar(avatar);
        }else{
            this.setAvatar(record.getPlayerAvatar());
        }

        let name = record.getNamePlayerInForm();
        if(name.trim() != ""){
            this.setPlayerName(name);
        }else{
            this.setPlayerName(record.getPlayerName());
        }

        let birthday = record.getBirthDay();
        if(birthday > -1){
            let newdate = new Date(birthday);
            this.setBirthday(Utils.getViewDate(newdate));
        }else{
            let newdate = new Date(record.getPlayerBirthday());
            this.setBirthday(Utils.getViewDate(newdate));
        }
    }

    public fromPlayer(player: Player){
        this.setPlayerID(player.getPlayerID());
        this.setLeagueID(player.getLeagueID());
        this.setClubID(player.getClubID());
        this.setPlayerID(player.getPlayerID());
        this.setAvatar(player.getAvatar());
        this.setBirthday(player.getBirthdayString());
        this.setPlayerName(player.getName());
        this.setClubName(player.getClubName());
    }
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

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }
       
        if (object.containsKey(ParamsKey.AVATAR)) {
            this.setAvatar(object.getUtfString(ParamsKey.AVATAR));
        }
       
        if (object.containsKey(ParamsKey.BIRTHDAY)) {
            if(object.getLong(ParamsKey.BIRTHDAY) > 0)this.setBirthdayFromDate(new Date(object.getLong(ParamsKey.BIRTHDAY)));
        }

        if (object.containsKey(ParamsKey.LEAGUE_NAME)) {
            this.setLeagueName(object.getUtfString(ParamsKey.LEAGUE_NAME));
        }
       
        if (object.containsKey(ParamsKey.CLUB_NAME)) {
            this.setClubName(object.getUtfString(ParamsKey.CLUB_NAME));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setPlayerName(object.getUtfString(ParamsKey.NAME));
        }

        if(object.containsKey(ParamsKey.DATA)){
            this.setMDatas(object.getUtfString(ParamsKey.DATA));
        }

    }

    public getState(): number {
        return this.state;
    }
    
    public setState(state: number) {
        this.state = state;
    }


    public getBirthday(): string {
        return this.birthDay;
    }

    public setBirthday(birthday: string) {
        this.birthDay = birthday;
    }

    public setBirthdayFromDate(date: Date){
        this.birthDay = Utils.getViewDate(date);
    }

    public getAvatar(): string {
        return this.avatar;
    }

    public setAvatar(avatar: string) {
        this.avatar = avatar;
    }
    public getLeagueName(): string {
        return this.leagueName;
    }

    public setLeagueName(leagueName: string) {
        this.leagueName = leagueName;
    }
    public getClubName(): string {
        return this.clubName;
    }

    public setClubName(clubName: string) {
        this.clubName = clubName;
    }
    public getPlayerName(): string {
        return this.playerName;
    }

    public setPlayerName(playerName: string) {
        this.playerName = playerName;
    }

    setPlayerID(playerID: number){
        this.playerID = playerID;
    }

    getPlayerID(): number{
        return this.playerID;
    }
    
    setLeagueID(leagueID: number){
        this.leagueID = leagueID;
    }

    getLeagueID(): number{
        return this.leagueID;
    }

    setClubID(clubID: number){
        this.clubID = clubID;
    }

    getClubID(): number{
        return this.clubID;
    }


  }