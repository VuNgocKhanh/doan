import { Match } from "../classes/matches";
import { ParamsKey } from "../classes/paramkeys";
import { Bd69SFSConnector } from "../smartfox/bd69-sfs-connector";
import { MatchEvent } from "../classes/mathchevent";

export class MatchesManager {

    mMatches: Array<Match> = [];

    constructor() { }

    addMatch(match: Match) {
        this.mMatches.push(match);
    }

    getMatchById(matchID: number): Match {
        if (this.mMatches.length == 0) return null;
        for (let match of this.mMatches) {
            if (match.getMatchID() == matchID) {
                return match;
            }
        }
        return null;
    }

    getMatchesByDate(date: Date, mMatches: Array<Match>): Array<Match> {
        let result: Array<Match> = [];
        for (let i = 0; i < mMatches.length; i++) {
            let match = mMatches[i].getTimeStartDate();
            if (date.getFullYear() == match.getFullYear() && date.getDate() == match.getDate() && date.getMonth() == match.getMonth()) {
                result.push(mMatches[i]);
            }
        }
        return result;
    }

    onResponeSFSArrayMatchEvent(sfsArray): Array<MatchEvent> {
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newMatchEvent = new MatchEvent();
                newMatchEvent.fromSFSobject(sfsdata);
                res.push(newMatchEvent);
            }
        }
        return res;
    }


    onResponeSFSArray(params): Array<Match> {
        let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
        let mMatches = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let home = sfsdata.getSFSObject(ParamsKey.HOME);
            let away = sfsdata.getSFSObject(ParamsKey.AWAY);
            let stadium = sfsdata.getSFSObject(ParamsKey.STADIUM);

            let newMatch = new Match();
            newMatch.fromSFSobject(sfsdata);
            if(home)newMatch.getHomeClub().fromSFSObject(home);
            if(away)newMatch.getAwayClub().fromSFSObject(away);
            if(stadium)newMatch.getStadium().fromSFSobject(stadium);
            newMatch.stadiumName = newMatch.getStadium().getName();
            mMatches.push(newMatch);
        }
        return mMatches;
    }

    onResponeSFSShortArray(params): Array<Match> {
        let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
        let mMatches = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let home = sfsdata.getSFSObject(ParamsKey.HOME);
            let away = sfsdata.getSFSObject(ParamsKey.AWAY);
            let newMatch = new Match();
            newMatch.fromSFSobject(sfsdata);
            newMatch.getHomeClub().fromSFSObject(home);
            newMatch.getAwayClub().fromSFSObject(away);
            mMatches.push(newMatch);
            if(i>=5) break;
        }
        return mMatches;
    }

    onFindDateInArray(array: Array<Match>): Array<Date> {
        let result: Array<Date> = [];
        for (let i = 0; i < array.length; i++) {
            let match = array[i].getTimeStartDate();
            if (i == 0) { result.push(match); }
            else {
                let check = false;
                for (let j = 0; j < result.length; j++) {
                    if (result[j].getFullYear() == match.getFullYear() && result[j].getDate() == match.getDate() && result[j].getMonth() == match.getMonth()) {
                        check = true;
                        break;
                    }
                }
                if (!check) {
                    result.push(match);
                }
            }
        }
        return result;
    }

    sendRequestGetMatchInfo(matchID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetMatchInfo(matchID, leagueID);
    }

    sendRequestUpdateMatchPlayers(matchID: number, leagueID: number, players: string, substitues: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateMatchPlayers(matchID, leagueID, players, substitues);
    }

    sendRequestAddMatchEvent(matchevent: MatchEvent) {
        Bd69SFSConnector.getInstance().sendRequestAddMatchEvent(matchevent);
    }

    sendRequestGetListMatchEvent(matchID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetListMatchEvent(matchID, leagueID);
    }

    sendRequestREMOVE_MATCH_EVENT(eventID: number, matchID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestREMOVE_MATCH_EVENT(eventID, matchID, leagueID);
    }

    sendRequestUPDATE_MATCH_EVENT(matchEvent: MatchEvent) {
        Bd69SFSConnector.getInstance().sendRequestUPDATE_MATCH_EVENT(matchEvent);
    }
    sendRequestMatchKickOff(matchevent: MatchEvent) {
        Bd69SFSConnector.getInstance().sendRequestMatchKickOff(matchevent);
    }
    sendRequestDeleteMatch(matchID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestDeleteMatch(matchID, leagueID);
    }
    sendRequestUpdateHomeGoal(match: Match) {
        Bd69SFSConnector.getInstance().sendRequestUpdateHomeGoal(match);
    }
    sendRequestUpdateAwayGoal(match: Match) {
        Bd69SFSConnector.getInstance().sendRequestUpdateAwayGoal(match);
    }

    sendRequestUPDATE_MATCH_RESULT(match: Match) {
        Bd69SFSConnector.getInstance().sendRequestUPDATE_MATCH_RESULT(match);
    }
    sendRequestUpdateMatchInfo(leagueID: number, info: Match) {
        Bd69SFSConnector.getInstance().sendRequestUpdateMatchInfo(leagueID, info);
    }
}