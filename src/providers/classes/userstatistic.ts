import { User } from "./user";
import { ParamsKey } from "./paramkeys";

export class UserStatistic {
    private userID: number = -1;
    public numberClub: number = 0;
    public numberLeague: number = 0;
    public numberNotification: number = 0;
    public numberRecord: number = 0;
    public numberGoal: number = 0;
    public numberAssist: number = 0;
    public numberRedCard: number = 0;
    public numberYellowCard: number = 0;
    private numberPlayed: number = 0;
    private numberPlayFromStart: number = 0;

    constructor() {

    }

    fromSFSObject(object) {
        if (object == null) {
            return;
        }
        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setUserID(object.getInt(ParamsKey.USER_ID));
        }
        if (object.containsKey(ParamsKey.NUMBER_CLUB)) {
            this.setNumberClub(object.getInt(ParamsKey.NUMBER_CLUB));
        }
        if (object.containsKey(ParamsKey.NUMBER_LEAGUE)) {
            this.setNumberLeague(object.getInt(ParamsKey.NUMBER_LEAGUE));
        }
        if (object.containsKey(ParamsKey.NUMBER_NOTIFICATION)) {
            this.setNumberNotification(object.getInt(ParamsKey.NUMBER_NOTIFICATION));
        }
        if (object.containsKey(ParamsKey.NUMBER_RECORD)) {
            // console.log("Container number record");
            
            this.setNumberRecord(object.getInt(ParamsKey.NUMBER_RECORD));
        }else{
            // console.log("not contain number record");
            
        }

        if (object.containsKey(ParamsKey.NUMBER_GOAL)) {
            this.setNumberGoal(object.getInt(ParamsKey.NUMBER_GOAL));
        }

        if (object.containsKey(ParamsKey.NUMBER_ASSIST)) {
            this.setNumberAssist(object.getInt(ParamsKey.NUMBER_ASSIST));
        }
        if (object.containsKey(ParamsKey.NUMBER_RED_CARD)) {
            this.setNumberRedCard(object.getInt(ParamsKey.NUMBER_RED_CARD));
        }
        if (object.containsKey(ParamsKey.NUMBER_YELLOW_CARD)) {
            this.setNumberYellowCard(object.getInt(ParamsKey.NUMBER_YELLOW_CARD));
        }

        if (object.containsKey(ParamsKey.NUMBER_PLAYED)) {
            this.setNumberPlayed(object.getInt(ParamsKey.NUMBER_PLAYED));
        }
        if (object.containsKey(ParamsKey.NUMBER_PLAY_FROM_START)) {
            this.setNumberPlayFromStart(object.getInt(ParamsKey.NUMBER_PLAY_FROM_START));
        }

        
    }

    setNumberPlayed(value: number){
        this.numberPlayed = value;
    }

    getNumberPlayed(): number{
        return this.numberPlayed;
    }

    setNumberPlayFromStart(value: number){
        this.numberPlayFromStart = value;
    }

    getNumberPlayFromStart(): number{
        return this.numberPlayFromStart;
    }

    setUserID(value: number) {
        this.userID = value;
    }
    setNumberClub(value: number) {
        this.numberClub = value;
    }
    setNumberLeague(value: number) {
        this.numberLeague = value;
    }
    setNumberNotification(value: number) {
        this.numberNotification = value;
    }
    setNumberGoal(value: number) {
        this.numberGoal = value;
    }
    setNumberRecord(value: number) {
        // console.log("Set number record : "+ value);
        
        this.numberRecord = value;
    }
    setNumberAssist(value: number) {
        this.numberAssist = value;
    }
    setNumberRedCard(value: number) {
        this.numberRedCard = value;
    }
    setNumberYellowCard(value: number) {
        this.numberYellowCard = value;
    }


    getUserID(): number {
        return this.userID;
    }
    getNumberClub(): number {
        return this.numberClub;
    }
    getNumberLeague(): number {
        return this.numberLeague;
    }
    getNumberNotification(): number {
        return this.numberNotification;
    }

    getNumberGoal(): number {
        return this.numberGoal;
    }
    getNumberRecord(): number {
        return this.numberRecord;
    }
    getNumberAssist(): number {
        return this.numberAssist;
    }
    getNumberRedCard(): number {
        return this.numberRedCard;
    }
    getNumberYellowCard(): number {
        return this.numberYellowCard;
    }

}