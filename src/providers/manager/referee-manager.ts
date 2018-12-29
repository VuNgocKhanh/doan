import { Referee, RefereInLeague, RefereeInMatch } from "../classes/referee";
import { Bd69SFSConnector } from "../smartfox/bd69-sfs-connector";

export class RefereeManager {

    public static instance: RefereeManager = null;

    public mReferees: Array<Referee> = [];

    constructor() { }

    public static getInstance(): RefereeManager {
        if (this.instance == null) {
            this.instance = new RefereeManager();
        }
        return this.instance;
    }

    public addReferee(ref: Referee){
        this.mReferees.push(ref);
    }

    public getRefereeByID(id: number){
        if(this.mReferees.length == 0) return null;
        for(let ref of this.mReferees){
            if(ref.getRefereeID() == id){
                return ref;
            }
        }
    }
    onParseSFSArray(sfsArray): Array<Referee> {
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newRef = new Referee();
                newRef.fromSFSObject(sfsdata);
                let ref = this.getRefereeByID(newRef.getRefereeID());
                if(ref){
                    ref.fromSFSObject(sfsdata);
                }else{
                    this.addReferee(newRef);                    
                }
                res.push(newRef);
            }
        }
        return res;
    }

    

    onParseSFSRefereeInLeagueArray(sfsArray,leagueID?:number): Array<RefereInLeague> {
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newRef = new RefereInLeague();
                newRef.fromSFSObject(sfsdata);
                if(leagueID)newRef.setLeagueID(leagueID);
                res.push(newRef);
            }
        }
        return res;
    }

    onParseSFSRefereeInMatchArray(sfsArray,leagueID?:number): Array<RefereeInMatch> {
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newRef = new RefereeInMatch();
                newRef.fromSFSObject(sfsdata);
                if(leagueID)newRef.setLeagueID(leagueID);
                res.push(newRef);
            }
        }
        return res;
    }

    sendRequestADD_NEW_REFEREE(referee: Referee) {
        Bd69SFSConnector.getInstance().sendRequestADD_NEW_REFEREE(referee);
    }
    sendRequestUPDATE_REFEREE_INFO(referee: Referee) {
        Bd69SFSConnector.getInstance().sendRequestUPDATE_REFEREE_INFO(referee);
    }
    sendRequestUPDATE_REFEREE_AVATAR(refereeID: number, avatar: string) {
        Bd69SFSConnector.getInstance().sendRequestUPDATE_REFEREE_AVATAR(refereeID, avatar);
    }
    sendRequestUPDATE_REFEREE_COVER(refereeID: number, cover: string) {
        Bd69SFSConnector.getInstance().sendRequestUPDATE_REFEREE_COVER(refereeID, cover);
    }
    sendRequestADD_REFEREE_INTO_LEAGUE(refereeID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestADD_REFEREE_INTO_LEAGUE(refereeID, leagueID);
    }
    sendRequestREMOVE_REFEREE_FROM_LEAGUE(refereeID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestREMOVE_REFEREE_FROM_LEAGUE(refereeID, leagueID);
    }
    sendRequestGET_LIST_REFEREE_IN_LEAGUE(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGET_LIST_REFEREE_IN_LEAGUE(leagueID);
    }
    sendRequestSEARCH_REFEREE(searchQuery: string, page?: number){
        Bd69SFSConnector.getInstance().sendRequestSEARCH_REFEREE(searchQuery,page ? page : null);
    }
}