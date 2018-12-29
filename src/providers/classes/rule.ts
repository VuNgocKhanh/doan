import { ParamsKey } from "./paramkeys";
import { CalendarDate } from "../core/calendar/calendar-date";

var SFS2X = window['SFS2X'];

export class Rule {
    
    private leagueID: number = -1;
    
    private wonPoint: number = 3;
    
    private drawnPoint: number = 1;
    
    private lostPoint: number = 0;
    
    private pointPriority: number = 10;
    
    private gdPriority: number = 9;
    
    private namePriority: number = 8;
    
    private againstPriority: number = 7;
    
    private fairplayPriority: number = 6;
    
    private duration: number = 90;
    
    private maxPlayerPerClub: number = 24;
    
    private numberPlayPlayer: number = 11;

    private break_time: number = 7;
    
    private record_enable: number = 1;
    
    private record_start: number = -1;
    
    private record_end: number = -1;
    
    private substitue: number = 1;

    private refereeInMatch: number = 3;


    constructor(){}

    public getArrayVariable(){
        return [
            this.wonPoint,this.drawnPoint,this.lostPoint,this.pointPriority,
            this.gdPriority,this.namePriority,this.againstPriority,
            this.fairplayPriority,this.duration,this.maxPlayerPerClub,
            this.numberPlayPlayer,this.break_time,this.record_enable,this.record_start,
            this.record_end,this.substitue,this.refereeInMatch
        ];
    }

    public getRecordStartDate(): CalendarDate{
        if(this.record_start > -1){
            let newCal = new CalendarDate();
            newCal.setTime(new Date(this.record_start));
            return newCal;
        }else{
            return new CalendarDate();
        }
    }
    public getRecordEndDate(): CalendarDate{
        if(this.record_end > -1){
            let newCal = new CalendarDate();
            newCal.setTime(new Date(this.record_end));
            return newCal;
        }else{
            return new CalendarDate();
        }
    }


    public toSFSObject(){
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.LEAGUE_ID, parseInt(this.getLeagueID()+""));
		obj.putInt(ParamsKey.WON_POINT, parseInt(this.getWonPoint()+""));
		obj.putInt(ParamsKey.DRAWN_POINT, parseInt(this.getDrawnPoint()+""));
		obj.putInt(ParamsKey.LOST_POINT, parseInt(this.getLostPoint()+""));
		obj.putInt(ParamsKey.POINT_PRIORITY, parseInt(this.getPointPriority()+""));
		obj.putInt(ParamsKey.GD_PRIORITY, parseInt(this.getGdPriority()+""));
		obj.putInt(ParamsKey.NAME_PRIORITY, parseInt(this.getNamePriority()+""));
		obj.putInt(ParamsKey.AGAINST_PRIORITY, parseInt(this.getAgainstPriority()+""));
		obj.putInt(ParamsKey.FAIRPLAY_PRIORITY, parseInt(this.getFairplayPriority()+""));
		obj.putInt(ParamsKey.DURATION, parseInt(this.getDuration()+""));
		obj.putInt(ParamsKey.MAX_PLAYER_PER_CLUB, parseInt(this.getMaxPlayerPerClub()+""));
		obj.putInt(ParamsKey.NUMBER_PLAY_PLAYER, parseInt(this.getNumberPlayPlayer()+""));
		obj.putInt(ParamsKey.BREAK_TIME, parseInt(this.getBreakTime()+""));
		obj.putInt(ParamsKey.SUBSTITUTE, parseInt(this.getSubstitue()+""));
		obj.putInt(ParamsKey.REFEREE_IN_MATCH, parseInt(this.getRefereeInMatch()+""));
		obj.putInt(ParamsKey.RECORD_ENABLE, parseInt(this.getRecordEnable()+""));
		obj.putLong(ParamsKey.RECORD_START, parseInt(this.getRecordStart()+""));
		obj.putLong(ParamsKey.RECORD_END, parseInt(this.getRecordEnd()+""));
        return obj;
    }
    
    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }
        
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        
        if (object.containsKey(ParamsKey.WON_POINT)) {
            this.setWonPoint(object.getInt(ParamsKey.WON_POINT));
        }
        
        if (object.containsKey(ParamsKey.DRAWN_POINT)) {
            this.setDrawnPoint(object.getInt(ParamsKey.DRAWN_POINT));
        }
        
        if (object.containsKey(ParamsKey.LOST_POINT)) {
            this.setLostPoint(object.getInt(ParamsKey.LOST_POINT));
        }
        
        if (object.containsKey(ParamsKey.POINT_PRIORITY)) {
            this.setPointPriority(object.getInt(ParamsKey.POINT_PRIORITY));
        }
        
        if (object.containsKey(ParamsKey.GD_PRIORITY)) {
            this.setGdPriority(object.getInt(ParamsKey.GD_PRIORITY));
        }
        
        if (object.containsKey(ParamsKey.NAME_PRIORITY)) {
            this.setNamePriority(object.getInt(ParamsKey.NAME_PRIORITY));
        }
        
        if (object.containsKey(ParamsKey.AGAINST_PRIORITY)) {
            this.setAgainstPriority(object.getInt(ParamsKey.AGAINST_PRIORITY));
        }
        
        if (object.containsKey(ParamsKey.FAIRPLAY_PRIORITY)) {
            this.setFairplayPriority(object.getInt(ParamsKey.FAIRPLAY_PRIORITY));
        }
        
        if (object.containsKey(ParamsKey.DURATION)) {
            this.setDuration(object.getInt(ParamsKey.DURATION));
        }
        
        if (object.containsKey(ParamsKey.MAX_PLAYER_PER_CLUB)) {
            this.setMaxPlayerPerClub(object.getInt(ParamsKey.MAX_PLAYER_PER_CLUB));
        }
        
        if (object.containsKey(ParamsKey.NUMBER_PLAY_PLAYER)) {
            this.setNumberPlayPlayer(object.getInt(ParamsKey.NUMBER_PLAY_PLAYER));
        }


        if (object.containsKey(ParamsKey.BREAK_TIME)) {
            this.setBreakTime(object.getInt(ParamsKey.BREAK_TIME));
        }

        if (object.containsKey(ParamsKey.REFEREE_IN_MATCH)) {
            this.setRefereeInMatch(object.getInt(ParamsKey.REFEREE_IN_MATCH));
        }
        
        if (object.containsKey(ParamsKey.SUBSTITUTE)) {
            this.setSubstitue(object.getInt(ParamsKey.SUBSTITUTE));
        }
        
        if (object.containsKey(ParamsKey.RECORD_ENABLE)) {
            this.setRecordEnable(object.getInt(ParamsKey.RECORD_ENABLE));
        }
        
        if (object.containsKey(ParamsKey.RECORD_START)) {
            this.setRecordStart(object.getLong(ParamsKey.RECORD_START));
        }

        if (object.containsKey(ParamsKey.RECORD_END)) {
            this.setRecordEnd(object.getLong(ParamsKey.RECORD_END));
        }
        
    }

    
    
    public getLeagueID(): number {
        return this.leagueID;
    }
    
    public setLeagueID(ruleID: number) {
        this.leagueID = ruleID;
    }
    
    public getWonPoint(): number {
        return this.wonPoint;
    }
    
    public setWonPoint(wonPoint: number) {
        this.wonPoint = wonPoint;
    }
    
    public getDrawnPoint(): number {
        return this.drawnPoint;
    }
    
    public setDrawnPoint(drawnPoint: number) {
        this.drawnPoint = drawnPoint;
    }
    
    public getLostPoint(): number {
        return this.lostPoint;
    }
    
    public setLostPoint(lostPoint: number) {
        this.lostPoint = lostPoint;
    }
    
    public getPointPriority(): number {
        return this.pointPriority;
    }
    
    public setPointPriority(pointPriority: number) {
        this.pointPriority = pointPriority;
    }
    
    public getGdPriority(): number {
        return this.gdPriority;
    }
    
    public setGdPriority(gdPriority: number) {
        this.gdPriority = gdPriority;
    }
    
    public getNamePriority(): number {
        return this.namePriority;
    }
    
    public setNamePriority(namePriority: number) {
        this.namePriority = namePriority;
    }
    
    public getAgainstPriority(): number {
        return this.againstPriority;
    }
    
    public setAgainstPriority(againstPriority: number) {
        this.againstPriority = againstPriority;
    }
    
    public getFairplayPriority(): number {
        return this.fairplayPriority;
    }
    
    public setFairplayPriority(fairplayPriority: number) {
        this.fairplayPriority = fairplayPriority;
    }
    
    public getDuration(): number {
        return this.duration;
    }
    
    public setDuration(duration: number) {
        this.duration = duration;
    }
    
    public getMaxPlayerPerClub(): number {
        return this.maxPlayerPerClub;
    }
    
    public setMaxPlayerPerClub(maxPlayerPerClub: number) {
        this.maxPlayerPerClub = maxPlayerPerClub;
    }
    
    public getNumberPlayPlayer(): number {
        return this.numberPlayPlayer;
    }
    
    public setNumberPlayPlayer(numberPlayPlayer: number) {
        this.numberPlayPlayer = numberPlayPlayer;
    }
    //
    public getBreakTime(): number {
        return this.break_time;
    }
    
    public setBreakTime(break_time: number) {
        this.break_time = break_time;
    }
    
    public getRefereeInMatch(): number {
        return this.refereeInMatch;
    }
    
    public setRefereeInMatch(referee: number) {
        this.refereeInMatch = referee;
    }

    public setRecordEnable(en: number){
        this.record_enable = en;
    }

    public getRecordEnable(): number{
        return this.record_enable;
    }

    public setRecordStart(res: number){
        this.record_start = res;
    }

    public getRecordStart(): number{
        return this.record_start;
    }

    public setRecordEnd(ree: number){
        this.record_end = ree;
    }

    public getRecordEnd(): number{
        return this.record_end;
    }

    public setSubstitue(sub: number){
        this.substitue = sub;
    }

    public getSubstitue(): number{
        return this.substitue;
    }
}