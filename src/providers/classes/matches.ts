import { ParamsKey } from "./paramkeys";
import { ClubInLeague } from "./clubinleague";
import { ClubInMatch } from "./clubinmatch";
import { Stadium } from "./stadium";
import { RefereeInMatch } from "./referee";
import { Utils } from "../core/app/utils";
var SFS2X = window['SFS2X'];

export class Match {

    private leagueName: string = "";

    private leagueCover: string = "";
    
    public stadiumName: string  = "";

    private time: number = 60;

    private matchID: number = -1;

    private roundID: number = -1;

    private groupID: number = -1;

    private leagueID: number = -1;

    private stadiumID: number = -1;

    private homeID: number = -1;

    private homeGoal: number = 0;

    private awayID: number = -1;

    private awayGoal: number = 0;

    private name: string = "";

    private state: number = 0;

    private timeStart: number = 0;

    private duration: number = 90;

    private timeCreated: number = 0;

    private mHomeClub: ClubInMatch = new ClubInMatch();

    private mAwayClub: ClubInMatch = new ClubInMatch();

    private mStadium: Stadium = new Stadium();

    private mListReferee: Array<RefereeInMatch> = [];

    private submitState: number = 0;

    constructor() { }

    public getStadium(): Stadium{
        return this.mStadium;
    }

    public setStadium(stadium: Stadium){
        this.mStadium = stadium;
        this.stadiumName = this.mStadium.getName();
    }

    public fromObject(match: Match){
        if(match == null )return;
        this.setMatchID(match.getMatchID());
        this.setLeagueID(match.getLeagueID());
        this.setRoundID(match.getRoundID());
        this.setStadiumID(match.getStadiumID());
        this.setHomeID(match.getHomeID());
        this.setAwayID(match.getAwayID());
        this.setHomeClub(match.getHomeClub());
        this.setAwayClub(match.getAwayClub());
        this.setState(match.getState());
        this.setTimeStart(match.getTimeStart());
        this.setDuration(match.getDuration());
        this.setleagueCover(match.getleagueCover());
    }

    getTimeStartDate(): Date {
        return new Date(this.timeStart);
    }

    public toSFSObjectUpdateInfo() {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.MATCH_ID,this.getMatchID());
        obj.putInt(ParamsKey.DURATION, this.getDuration());
        obj.putInt(ParamsKey.HOME_ID, this.getHomeID());
        obj.putInt(ParamsKey.AWAY_ID, this.getAwayID());
        obj.putLong(ParamsKey.TIME_START, this.getTimeStart());
        obj.putInt(ParamsKey.STADIUM_ID, this.getStadiumID());
        obj.putUtfString(ParamsKey.COVER, this.getleagueCover())
        return obj;
    }


    public toSFSObjectAddNewMatch() {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.ROUND_ID,this.getRoundID());
        obj.putInt(ParamsKey.HOME_ID, this.getHomeID());
        obj.putInt(ParamsKey.AWAY_ID, this.getAwayID());
        obj.putInt(ParamsKey.LEAGUE_ID, this.getLeagueID());
        if(this.duration > 0) obj.putInt(ParamsKey.DURATION, this.getDuration());
        if (this.timeStart > 0) obj.putLong(ParamsKey.TIME_START, this.getTimeStart());
        if (this.stadiumID > -1) obj.putInt(ParamsKey.STADIUM_ID, this.getStadiumID());
        return obj;
    }

    public toSFSObject() {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.LEAGUE_ID, this.getLeagueID());
        obj.putInt(ParamsKey.STADIUM_ID, this.getStadiumID());
        obj.putInt(ParamsKey.HOME_ID, this.getHomeID());
        obj.putInt(ParamsKey.HOME_GOAL, this.getHomeGoal());
        obj.putInt(ParamsKey.AWAY_ID, this.getAwayID());
        obj.putInt(ParamsKey.AWAY_GOAL, this.getAwayGoal());
        obj.putUtfString(ParamsKey.NAME, this.getName());
        obj.putLong(ParamsKey.TIME_START, this.getTimeStart());
        obj.putInt(ParamsKey.DURATION, this.getDuration());
        obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
        return obj;
    }
    public fromSFSobject(object: any) {

        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.MATCH_ID)) {
            this.setMatchID(object.getInt(ParamsKey.MATCH_ID));
        }

        if (object.containsKey(ParamsKey.ROUND_ID)) {
            this.setRoundID(object.getInt(ParamsKey.ROUND_ID));
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }

        if (object.containsKey(ParamsKey.STADIUM_ID)) {
            this.setStadiumID(object.getInt(ParamsKey.STADIUM_ID));
        }

        if (object.containsKey(ParamsKey.HOME_ID)) {
            this.setHomeID(object.getInt(ParamsKey.HOME_ID));
        }


        if (object.containsKey(ParamsKey.HOME_GOAL)) {
            this.setHomeGoal(object.getInt(ParamsKey.HOME_GOAL));
        }

        if (object.containsKey(ParamsKey.AWAY_ID)) {
            this.setAwayID(object.getInt(ParamsKey.AWAY_ID));
        }

        
        if (object.containsKey(ParamsKey.AWAY_GOAL)) {
            this.setAwayGoal(object.getInt(ParamsKey.AWAY_GOAL));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }


        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.TIME_START)) {
            this.setTimeStart(object.getLong(ParamsKey.TIME_START));
        }

        if (object.containsKey(ParamsKey.DURATION)) {
            this.setDuration(object.getInt(ParamsKey.DURATION));
        }

        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

        if (object.containsKey(ParamsKey.GROUP_ID)) {
            this.setGroupID(object.getInt(ParamsKey.GROUP_ID));
        }

        if(object.containsKey(ParamsKey.SUBMIT_STATE)){
            this.setSubmitState(object.getInt(ParamsKey.SUBMIT_STATE));
        }

        if(object.containsKey(ParamsKey.LEAGUE_NAME)){
            this.setLeagueName(object.getUtfString(ParamsKey.LEAGUE_NAME));
        }
        
        if(object.containsKey("league_cover")){
            this.setleagueCover(object.getUtfString("league_cover"));
        }

    }

    public setSubmitState(state : number){
        this.submitState = state;
    }
    
    public getSubmitState() : number{
        return this.submitState;
    }

    public onResponeReferee(sfsArray){
        if(sfsArray){
            this.mListReferee = [];
            for(let i = 0; i < sfsArray.size(); i++){
                let sfsdata = sfsArray.getSFSObject(i);
                let newReferee = new RefereeInMatch();
                newReferee.fromSFSObject(sfsdata);
                this.mListReferee.push(newReferee);
            }
        }
    }

    public getListRefereeInMatch(){
        return this.mListReferee;
    }
    public getGroupID(): number {
        return this.groupID;
    }

    public setGroupID(groupID: number) {
        this.groupID = groupID;
    }

    public getHomeClub(): ClubInMatch {
        return this.mHomeClub;
    }

    public setHomeClub(club: ClubInMatch) {
        this.mHomeClub = club;
    }
   
    public getAwayClub(): ClubInMatch {
        return this.mAwayClub;
    }

    public setAwayClub(club: ClubInMatch) {
        this.mAwayClub = club;
    }
   

    public setLeagueName(leagueName: string){
        this.leagueName = leagueName;
    }

    public getLeagueName(): string{
        return this.leagueName;
    }

    public setleagueCover(leagueCover: string){
        this.leagueCover = leagueCover;
    }

    public getleagueCover(): string{
        return this.leagueCover;
    }

    public getRoundID(): number {
        return this.roundID;
    }

    public setRoundID(roundID: number) {
        this.roundID = roundID;
    }

    public getMatchID(): number {
        return this.matchID;
    }

    public setMatchID(matchID: number) {
        this.matchID = matchID;
    }

    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }

    public getStadiumID(): number {
        return this.stadiumID;
    }

    public setStadiumID(stadiumID: number) {
        this.stadiumID = stadiumID;
    }

    public getHomeID(): number {
        return this.homeID;
    }

    public setHomeID(homeID: number) {
        this.homeID = homeID;
    }


    public getHomeGoal(): number {
        return this.homeGoal;
    }

    public setHomeGoal(homeGoal: number) {
        this.homeGoal = homeGoal;
    }

    public getAwayID(): number {
        return this.awayID;
    }

    public setAwayID(awayID: number) {
        this.awayID = awayID;
    }

    public getAwayGoal(): number {
        return this.awayGoal;
    }

    public setAwayGoal(awayGoal: number) {
        this.awayGoal = awayGoal;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number) {
        this.state = state;
    }

    public getTimeStart(): number {
        return this.timeStart;
    }

    public setTimeStart(timeStart: number) {
        this.timeStart = timeStart;
    }

    public getDuration(): number {
        return this.duration;
    }

    public setDuration(duration: number) {
        this.duration = duration;
    }

    public getTimeCreated(): number {
        return this.timeCreated;
    }

    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }

    public getTimeString(): string{
        let date = new Date(this.timeStart);
        let time = Utils.getStringNumber(date.getHours()) + ":"+Utils.getStringNumber(date.getMinutes());
        let day = "Ngày " + Utils.getViewDate(date);

        return time +" "+ day;
    }
}