import { ParamsKey } from "./paramkeys";
import { CalendarDate } from "../core/calendar/calendar-date";
import { RoleInClub, LeagueState } from "../manager/constant-manager";

var SFS2X = window['SFS2X'];

export class Leagues {

    private leagueAdminName: string = "";

    private leagueAdminID: number = -1;

    private leagueAdminAvatar: string = "";

    private leagueID: number = -1;

    private name: string = "";

    private logo: string = "";

    private cover: string = "";

    private description: string = "";

    private state: number = -1;

    private numberClub: number = 0;

    private timeStart: number = 0;

    private timeEnd: number = 0;

    private timeCreated: number = 0;

    private ruleID: number = -1;

    private numberClubJoined: number = 0;

    private roleOfUserInLeague: number = RoleInClub.GUEST;

    private type: number = 0;

    private clubID: number = -1;

    constructor() { }

    public setLeagueAdminAvatar(avatar: string) {
        this.leagueAdminAvatar = avatar;
    }

    public getLeagueAdminAvatar(): string {
        return this.leagueAdminAvatar;
    }

    public setLeagueAdminName(name: string) {
        this.leagueAdminName = name;
    }

    public getLeagueAdminName(): string {
        return this.leagueAdminName;
    }

    public setLeagueAdminID(id: number) {
        this.leagueAdminID = id;
    }

    public getLeagueAdminID(): number {
        return this.leagueAdminID;
    }



    public getArrayVariable() {
        return [this.name, this.numberClub, this.type, this.timeStart, this.timeEnd];
    }

    getTimeStartD(): Date {
        return new Date(this.timeStart)
    }

    getTimeStartDate(): CalendarDate {
        if (this.timeStart > 0) {
            let date = new Date(this.timeStart);
            let calendar = new CalendarDate();
            calendar.setDate(date.getDate(), date.getMonth(), date.getFullYear());
            return calendar;
        }
        return new CalendarDate();
    }

    getTimeEndDate(): CalendarDate {
        if (this.timeEnd > 0) {
            let date = new Date(this.timeEnd);
            let calendar = new CalendarDate();
            calendar.setDate(date.getDate(), date.getMonth(), date.getFullYear());
            return calendar;
        }
        return new CalendarDate();
    }

    getDescription(): string {
        return this.description;
    }
    setDescription(des: string) {
        this.description = des;
    }

    public toSFSObject() {
        let obj = new SFS2X.SFSObject();

        obj.putInt(ParamsKey.LEAGUE_ID, this.getLeagueID());
        obj.putUtfString(ParamsKey.NAME, this.getName());
        obj.putUtfString(ParamsKey.DESCRIPTION, this.getDescription());
        obj.putUtfString(ParamsKey.LOGO, this.getLogo());
        obj.putUtfString(ParamsKey.COVER, this.getCover());
        obj.putInt(ParamsKey.STATE, this.getState());
        obj.putInt(ParamsKey.TYPE, this.getType());
        obj.putInt(ParamsKey.NUMBER_CLUB, this.getNumberClub());
        obj.putInt(ParamsKey.NUMBER_CLUB_JOINED, this.getNumberClubJoin());
        obj.putLong(ParamsKey.TIME_START, this.getTimeStart());
        obj.putLong(ParamsKey.TIME_END, this.getTimeEnd());
        obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());

        return obj;
    }

    public fromObject(objec: Leagues) {
        this.setLeagueID(objec.getLeagueID());
        this.setName(objec.getName());
        this.setNumberClub(objec.getNumberClub());
        this.setTimeStart(objec.getTimeStart());
        this.setTimeEnd(objec.getTimeEnd());
        this.setLogo(objec.getLogo());
        this.setCover(objec.getCover());
        this.setNumberClubJoin(objec.getNumberClubJoin());
    }

    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.MANAGER)) {
            let manager = object.getSFSObject(ParamsKey.MANAGER);
            if (manager.containsKey(ParamsKey.USER_ID)) {
                this.setLeagueAdminID(manager.getInt(ParamsKey.USER_ID));
            }

            if (manager.containsKey(ParamsKey.NAME)) {
                this.setLeagueAdminName(manager.getUtfString(ParamsKey.NAME));
            }

            if (manager.getUtfString(ParamsKey.AVATAR)) {
                this.setLeagueAdminAvatar(manager.getUtfString(ParamsKey.AVATAR));
            }
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
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
            
            if (object.containsKey(ParamsKey.TIME_START) && object.containsKey(ParamsKey.TIME_END)) {
                let timeStart = object.getLong(ParamsKey.TIME_START);
                let timeEnd = object.getLong(ParamsKey.TIME_END);
                let timeNow = new Date().getTime();
                
                if (timeStart > timeNow) {
                    this.setState(LeagueState.INCOMING);
                } else if (timeStart < timeNow && timeNow < timeEnd) {
                    this.setState(LeagueState.BEGAN);
                } else if (timeNow > timeEnd) {
                    this.setState(LeagueState.STOP);
                }
            } else {
                this.setState(object.getInt(ParamsKey.STATE));
            }
        }

        if (object.containsKey(ParamsKey.NUMBER_CLUB)) {
            this.setNumberClub(object.getInt(ParamsKey.NUMBER_CLUB));
        }

        if (object.containsKey(ParamsKey.TIME_START)) {
            this.setTimeStart(object.getLong(ParamsKey.TIME_START));
        }

        if (object.containsKey(ParamsKey.TIME_END)) {
            this.setTimeEnd(object.getLong(ParamsKey.TIME_END));
        }

        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

        if (object.containsKey(ParamsKey.RULE_ID)) {
            this.setRuleID(object.getInt(ParamsKey.RULE_ID));
        }

        if (object.containsKey(ParamsKey.ROLE)) {
            this.setRoleOfUserInLeague(object.getInt(ParamsKey.ROLE));
        }

        if (object.containsKey(ParamsKey.NUMBER_CLUB_JOINED)) {
            this.setNumberClubJoin(object.getInt(ParamsKey.NUMBER_CLUB_JOINED));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }

    }

    public setClubID(number: number) {
        this.clubID = number;
    }

    public getClubID(): number {
        return this.clubID;
    }

    public setType(number: number) {
        this.type = number;
    }

    public getType(): number {
        return this.type;
    }

    public setNumberClubJoin(number: number) {
        this.numberClubJoined = number;
    }

    public getNumberClubJoin(): number {
        return this.numberClubJoined;
    }


    public setRoleOfUserInLeague(role: number) {
        this.roleOfUserInLeague = role;
    }

    public getRoleOfUserInLeague(): number {
        return this.roleOfUserInLeague;
    }


    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
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

    public getNumberClub(): number {
        return this.numberClub;
    }

    public setNumberClub(numberClub: number) {
        this.numberClub = numberClub;
    }

    public getTimeStart(): number {
        return this.timeStart;
    }

    public setTimeStart(timeStart: number) {
        this.timeStart = timeStart;
    }

    public getTimeEnd(): number {
        return this.timeEnd;
    }

    public setTimeEnd(timeEnd: number) {
        this.timeEnd = timeEnd;
    }

    public getTimeCreated(): number {
        return this.timeCreated;
    }

    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }

    public getRuleID(): number {
        return this.ruleID;
    }

    public setRuleID(ruleID: number) {
        this.ruleID = ruleID;
    }
}