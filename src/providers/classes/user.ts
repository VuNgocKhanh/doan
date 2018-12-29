import { ParamsKey } from "./paramkeys";
import { UserStatistic } from "./userstatistic";
import { Utils } from "../core/app/utils";
import { CalendarDate } from "../core/calendar/calendar-date";


export class User {

    private userID: number = -1;

    private username: string = "";

    private name: string = "";

    private birthday: number = -1;

    private avatar: string = "";

    private phone: string = "";

    private state: number = -1;

    private cover: string = "";

    private money: number = 0;

    private point: number = 0;

    private description: string = "";

    private slogan: string = "";

    private facebook_id: string = "";

    private google_id: string = "";

    private login_type: number = -1;

    private last_login: number = -1;

    private role: number = 0;

    private type: number = 0;

    private height: number = 0;

    private weight: number = 0;

    public userStatistic: UserStatistic = new UserStatistic();

    constructor() { }

    fromObject(object: User) {
        if (object.userID) this.setUserID(object.getUserID());
        if (object.username) this.setUsername(object.getUsername());
        if (object.name) this.setName(object.getName());
        if (object.avatar) this.setAvatar(object.getAvatar());
        if (object.cover) this.setCover(object.getCover());
        if (object.role) this.setRole(object.getRole());
        if (object.type) this.setType(object.getType());
        if (object.birthday) this.setBirthday(object.getBirthday());
        if (object.phone) this.setPhone(object.getPhone());
        if (object.slogan) this.setSlogan(object.getSlogan());
        if (object.description) this.setDescription(object.getDescription());
    }

    public getBirthdayDate(): CalendarDate {
        if (this.birthday > 0) {
            let date = new Date(this.birthday);
            let calendar = new CalendarDate();
            calendar.setDate(date.getDate(), date.getMonth(), date.getFullYear());
            return calendar;
        }
        return new CalendarDate();
    }

    public getBirthdayString(): string {
        return Utils.getViewDate(new Date(this.birthday));
    }

    public fromSFSObject(object: any) {

        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setUserID(object.getInt(ParamsKey.USER_ID));
        }

        if (object.containsKey(ParamsKey.USERNAME)) {
            this.setUsername(object.getUtfString(ParamsKey.USERNAME));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.BIRTHDAY)) {
            this.setBirthday(object.getLong(ParamsKey.BIRTHDAY));
        }

        if (object.containsKey(ParamsKey.AVATAR)) {
            this.setAvatar(object.getUtfString(ParamsKey.AVATAR));
        }

        if (object.containsKey(ParamsKey.PHONE)) {
            this.setPhone(object.getUtfString(ParamsKey.PHONE));
        }

        if (object.containsKey(ParamsKey.FACEBOOK_ID)) {
            this.setFacebookID(object.getUtfString(ParamsKey.FACEBOOK_ID));
        }

        if (object.containsKey(ParamsKey.GOOGLE_ID)) {
            this.setGoogleID(object.getUtfString(ParamsKey.GOOGLE_ID));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.LOGIN_TYPE)) {
            this.setLoginType(object.getInt(ParamsKey.LOGIN_TYPE));
        }

        if (object.containsKey(ParamsKey.ROLE)) {
            this.setRole(object.getInt(ParamsKey.ROLE));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.COVER)) {
            this.setCover(object.getUtfString(ParamsKey.COVER));
        }

        if (object.containsKey(ParamsKey.MONEY)) {
            this.setMoney(object.getInt(ParamsKey.MONEY));
        }

        if (object.containsKey(ParamsKey.POINT)) {
            this.setPoint(object.getInt(ParamsKey.POINT));
        }

        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }

        if (object.containsKey(ParamsKey.SLOGAN)) {
            this.setSlogan(object.getUtfString(ParamsKey.SLOGAN));
        }

    }

    public setRole(role: number) {
        this.role = role;
    }

    public getRole(): number {
        return this.role;
    }

    public setType(type: number) {
        this.type = type;
    }

    public getType(): number {
        return this.type;
    }

    public setFacebookID(facebookID: string) {
        this.facebook_id = facebookID;
    }

    public getFacebookID(): string {
        return this.facebook_id;
    }

    public setGoogleID(googleID: string) {
        this.google_id = googleID;
    }

    public getGoogleID(): string {
        return this.google_id;
    }
    public setLoginType(type: number) {
        this.login_type = type;
    }

    public getLoginType(): number {
        return this.login_type;
    }

    public getUserID(): number {
        return this.userID;
    }

    public setUserID(userID: number) {
        this.userID = userID;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string) {
        this.username = username;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getBirthday(): number {
        return this.birthday;
    }

    public setBirthday(birthday: number) {
        this.birthday = birthday;
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
        this.phone = phone;
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number) {
        this.state = state;
    }

    public getCover(): string {
        return this.cover;
    }

    public setCover(cover: string) {
        this.cover = cover;
    }

    public getMoney(): number {
        return this.money;
    }

    public setMoney(money: number) {
        this.money = money;
    }

    public getPoint(): number {
        return this.point;
    }

    public setPoint(point: number) {
        this.point = point;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getSlogan(): string {
        return this.slogan;
    }

    public setSlogan(slogan: string) {
        this.slogan = slogan;
    }

    public getUserStatistic(): UserStatistic {
        return this.userStatistic;
    }

    public setUserStatistic(slogan: UserStatistic) {
        this.userStatistic = slogan;
    }
}



export class LeagueSearchUsers extends User {
    clubID: number = -1;
    clubName: string = "";
    constructor() {
        super();
    }

    public setClub(clubID: number, clubName: string){
        this.clubID = clubID;
        this.clubName = clubName;
    }

    public resetClub(){
        this.clubID = -1;
        this.clubName = "";
    }

    fromSFSObject(object){
        if(object == null) return;
        super.fromSFSObject(object);
        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.clubID = object.getInt(ParamsKey.CLUB_ID);
        }
        if (object.containsKey(ParamsKey.CLUB_NAME)) {
            this.clubName = object.getUtfString(ParamsKey.CLUB_NAME);
        }
    }

    public getClubID(): number {
        return this.clubID;
    }

    public setClubID(clubID: number) {
        this.clubID = clubID;
    }

    public getClubName(): string {
        return this.clubName;
    }

    public setClubName(clubName: string) {
        this.clubName = clubName;
    }
}

export class Editor extends User {
    private leagueID: number = -1;
    constructor() {
        super();
    }

    public fromObject(object: User) {
        this.setUserID(object.getUserID());
        this.setName(object.getName());
        this.setAvatar(object.getAvatar());
        // this.setNumberLeague(dornor.getNumberLeague());

    }

    public fromSFSObject(object: any) {
        super.fromSFSObject(object);
        if ((object == null)) {
            return;
        }
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
    }


    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }
}