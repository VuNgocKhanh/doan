import { Leagues } from "../classes/league";
import { Bd69SFSConnector } from "../smartfox/bd69-sfs-connector";
import { JoinLeagueRequest } from "../classes/joinleaguerequest";
import { RoleInLeague, RequestState, LeagueState } from "./constant-manager";
import { Stadium } from "../classes/stadium";
import { Rule } from "../classes/rule";
import { ClubInLeague } from "../classes/clubinleague";
import { Rounds } from "../classes/rounds";
import { Match } from "../classes/matches";
import { Group } from "../classes/group";
import { Clubs } from "../classes/clubs";
import { PlayerRecordInLeague } from "../classes/player_record_inleague";
import { TopGoalInLeague } from "../classes/top-goal-in-league";
import { Dornor, DornorInLeague } from "../classes/donnor";
import { User, Editor } from "../classes/user";
import { Referee, RefereInLeague } from "../classes/referee";
import { TopCardInLeague } from "../classes/top-card-in-league";


export class LeagueManager {
    public mLeagues: Array<Leagues> = [];

    public mLeagueOfUser: Array<Leagues> = [];

    public static instance: LeagueManager = null;

    private mStadiums: Array<Stadium> = [];

    public static getInstance(): LeagueManager {
        if (this.instance == null) {
            this.instance = new LeagueManager();
        }
        return this.instance;
    }

    mNextPage: number = 0;
    constructor() { }

    getListLeagueOfUser(): Array<Leagues>{
        return this.mLeagueOfUser;
    }

    addStadium(stadium: Stadium) {
        this.mStadiums.push(stadium);
    }

    getStadiumByID(id: number): Stadium {
        if (this.mStadiums.length == 0) return null;
        for (let stadium of this.mStadiums) {
            if (stadium.getStadiumID() == id) {
                return stadium;
            }
        }
    }
    addLeague(league: Leagues) {
        this.mLeagues.push(league);
    }

    checkLeaguebUserTakePartIn(leagueID: number): number {
        let check = -1;
        if (this.mLeagues.length == 0) return RoleInLeague.GUEST;
        for (let i = 0; i < this.mLeagues.length; i++) {
            if (this.mLeagues[i].getLeagueID() == leagueID) {
                check = this.mLeagues[i].getRoleOfUserInLeague();
            }
        }
        return check;
    }

    checkStateOfLeague(leagueID: number): number {
        let check = 0;
        if (this.mLeagues.length == 0) return LeagueState.INCOMING;
        for (let i = 0; i < this.mLeagues.length; i++) {
            if (this.mLeagues[i].getLeagueID() == leagueID) {
                check = this.mLeagues[i].getState();
            }
        }
        return check;
    }

    getLeagueByID(leagueID: number): Leagues {
        for (let league of this.mLeagues) {
            if (league.getLeagueID() == leagueID) {
                return league;
            }
        }
        return null;
    }

    onParseRoundList(sfsArray): Array<Rounds> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newRound = new Rounds();
            newRound.fromSFSObject(sfsdata);
            res.push(newRound);
        }
        return res;
    }
    onParsePlayerRecordInLeagueList(sfsArray): Array<PlayerRecordInLeague> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let mPlayerRecordInLeague = new PlayerRecordInLeague();
            mPlayerRecordInLeague.fromSFSobject(sfsdata);
            res.push(mPlayerRecordInLeague);
        }
        return res;
    }

    onParseGroupList(sfsArray): Array<Group> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newGroup = new Group();
            newGroup.fromSFSObject(sfsdata);
            res.push(newGroup);
        }
        return res;
    }

    onParseGoalListShort(sfsArray): Array<TopGoalInLeague> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newGoal = new TopGoalInLeague();
            newGoal.onResponeSFSObject(sfsdata);
            res.push(newGoal);
            if(i>=5) break;
        }
        return res;
    }

    onParseCardListShort(sfsArray): Array<TopCardInLeague> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newCard = new TopCardInLeague();
            newCard.onResponeSFSObject(sfsdata);
            res.push(newCard);
            if(i>=5) break;
        }
        return res;
    }

    onResponeDornorSFSArray(sfsArray): Array<Dornor> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newDornor = new Dornor();
            newDornor.fromSFSobject(sfsdata);
            res.push(newDornor);
        }
        return res;
    }

    onResponeDornorInLeagueSFSArray(sfsArray,leagueID?:number): Array<DornorInLeague> {
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newDor = new DornorInLeague();
                newDor.fromSFSObject(sfsdata);
                if(leagueID)newDor.setLeagueID(leagueID);
                res.push(newDor);
            }
        }
        return res;
    }

    onResponeClubManagerSFSArray(sfsArray): Array<User> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newUser = new User();
            newUser.fromSFSObject(sfsdata);
            res.push(newUser);
        }
        return res;
    }


    onResponeEditorSFSArray(sfsArray, leagueID?: number): Array<Editor> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newEditor = new Editor();
            newEditor.fromSFSObject(sfsdata);
            res.push(newEditor);
        }
        return res;
    }

    onResponeClubsSFSArray(sfsArray): Array<Clubs> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new Clubs();
            newClub.fromSFSobject(sfsdata);
            res.push(newClub);
        }
        return res;
    }

    onParseStadiumList(sfsArray): Array<Stadium> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newStadium = new Stadium();
            newStadium.fromSFSobject(sfsdata);
            let stadium = this.getStadiumByID(newStadium.getStadiumID());
            if (stadium) {
                stadium = newStadium;
            } else {
                this.addStadium(newStadium);
            }
            res.push(newStadium);
        }
        return res;
    }

    onParseClubInLeagueSFSArray(sfsArray, leagueID?:number): Array<ClubInLeague> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newCIL = new ClubInLeague();
            newCIL.onFromSFSobject(sfsdata);
            if(leagueID)newCIL.setLeagueID(leagueID);
            res.push(newCIL);
        }
        return res;
    }

    onParseClubInLeagueShortSFSArray(sfsArray): Array<ClubInLeague> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newCIL = new ClubInLeague();
            newCIL.onFromSFSobject(sfsdata);
            res.push(newCIL);
            if(i>=5) break;
        }
        return res;
    }

    onResponeSFSArray(sfsArray) {
        this.mLeagues = [];
        this.mLeagueOfUser = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newLeague = new Leagues();
                newLeague.fromSFSobject(sfsdata);
                this.mLeagueOfUser.push(newLeague);
                this.addLeague(newLeague);
            }
        }
    }

    onParseLeagueSFSArray(sfsArray): Array<Leagues> {
        let mLeagues = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newLeague = new Leagues();
                newLeague.fromSFSobject(sfsdata);
                let league = this.getLeagueByID(newLeague.getLeagueID());
                if (league) {
                    league.fromSFSobject(sfsdata);
                } else {
                    this.addLeague(newLeague);
                }
                mLeagues.push(newLeague);
            }
        }
        return mLeagues;
    }

    onResponeRefereeSFSArray(sfsArray): Array<RefereInLeague> {
        let res: Array<RefereInLeague> = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let data = sfsArray.getSFSObject(i);
                let newreferee = new RefereInLeague();
                newreferee.fromSFSObject(data);
                res.push(newreferee);
            }
        }
        return res;
    }

    

    onResponeEditorInLeagueSFSArray(sfsArray, leagueID?: number): Array<Editor> {
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newEditor = new Editor();
                newEditor.fromSFSObject(sfsdata);
                if (leagueID) newEditor.setLeagueID(leagueID);
                res.push(newEditor);
            }
        }
        return res;
    }

    onResponeUserSFSArray(sfsArray): Array<User> {
        let res: Array<User> = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let data = sfsArray.getSFSObject(i);
                let newuser = new User();
                newuser.fromSFSObject(data);
                res.push(newuser);
            }
        }
        return res;
    }

    getLeagues(): Array<Leagues> {
        return this.mLeagues;
    }

    onFakeData() {
        for (let i = 0; i < 10; i++) {
            let newLeague = new Leagues();
            newLeague.setName("Giải đấu " + i);
            newLeague.setRoleOfUserInLeague(RoleInLeague.LEAGUEMANAGER);
            this.mLeagues.push(newLeague);
        }
    }

    sendRequestUpdateLeagueInfo(league: Leagues) {
        Bd69SFSConnector.getInstance().sendRequestUpdateLeagueInfo(league);
    }

    public pairTwoLeague(oldLeague: Leagues, league2: Leagues): { check: boolean, league: Leagues } {
        let newLeague = new Leagues();
        newLeague.setLeagueID(league2.getLeagueID());
        let check = false;
        if (oldLeague.getName() != league2.getName()) {
            newLeague.setName(league2.getName());
            check = true;
        }
        if (oldLeague.getLogo() != league2.getLogo()) {
            newLeague.setLogo(league2.getLogo());
            check = true;

        }
        if (oldLeague.getCover() != league2.getCover()) {
            newLeague.setCover(league2.getCover());
            check = true;

        }
        if (oldLeague.getDescription() != league2.getDescription()) {
            newLeague.setDescription(league2.getDescription());
            check = true;

        }
        if (oldLeague.getNumberClub() != league2.getNumberClub()) {
            newLeague.setNumberClub(league2.getNumberClub());
            check = true;

        }
        if (oldLeague.getTimeStart() != league2.getTimeStart()) {
            newLeague.setTimeStart(league2.getTimeStart());
            check = true;

        }
        if (oldLeague.getTimeEnd() != league2.getTimeEnd()) {
            newLeague.setTimeEnd(league2.getTimeEnd());
            check = true;

        }
        return { check: check, league: newLeague };
    }

    checkLeagueIsChange(mLeague: Leagues, mOldLeague: Leagues) {
        let check = false;
        let oldRuleArray = mOldLeague.getArrayVariable();
        let newRuleArray = mLeague.getArrayVariable();
        for (let i = 0; i < oldRuleArray.length; i++) {
            if (oldRuleArray[i] != newRuleArray[i]) {
                check = true;
                break;
            }
        }
        return check;
    }

    checkRuleIsChange(oldRule: Rule, newRule: Rule): boolean {
        let check = false;
        let oldRuleArray = oldRule.getArrayVariable();
        let newRuleArray = newRule.getArrayVariable();
        for (let i = 0; i < oldRuleArray.length; i++) {
            if (oldRuleArray[i] != newRuleArray[i]) {
                check = true;
                break;
            }
        }
        return check;
    }



    sendRequestUpdateLeagueLogo(leagueID: number, logo: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateLeagueLogo(leagueID, logo);
    }

    sendRequestUpdateLeagueCover(leagueID: number, cover: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateLeagueCover(leagueID, cover);
    }

    sendRequestUpdateLeagueRule(rule: Rule) {
        Bd69SFSConnector.getInstance().sendRequestUpdateLeagueRule(rule);
    }

    getRecentLeagues() {
        return this.mLeagues.filter((ele, index) => {
            return index < 2;
        })
    }

    onAcceptRequest(leagueID: number, clubID: number) {
        this.processRequestJoinLeague(leagueID, clubID, RequestState.ACCEPT);
    }

    onDelineRequest(leagueID: number, clubID: number) {
        this.processRequestJoinLeague(leagueID, clubID, RequestState.DELINE);
    }

    sendRequestSearchLeague(searchQuery: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestSearchLeague(searchQuery, page ? page : null);
    }
    sendRequestGetLeagueOfUser() {
        Bd69SFSConnector.getInstance().sendRequestGetLeagueOfUser();
    }

    sendRequestCreateLeague(newLeague: Leagues) {
        Bd69SFSConnector.getInstance().sendRequestCreateNewLeague(newLeague);
    }

    sendRequestJoinLeague(params: JoinLeagueRequest) {
        Bd69SFSConnector.getInstance().sendRequestJoinLeague(params);
    }

    sendRequestGetLeagueList(page?: number, state?: number) {
        Bd69SFSConnector.getInstance().sendRequestGetLeagueList(page ? page : 0, state ? state : null);
    }

    getRequestJoinOfLeague(leagueID: number) {
        Bd69SFSConnector.getInstance().getRequestJoinOfLeague(leagueID);
    }

    processRequestJoinLeague(leagueID: number, clubID: number, state: number) {
        Bd69SFSConnector.getInstance().processRequestJoinLeague(leagueID, clubID, state);
    }
    addClubIntoLeague(param: JoinLeagueRequest) {
        Bd69SFSConnector.getInstance().addClubIntoLeague(param);
    }

    getClubInLeague(leagueID: number) {
        Bd69SFSConnector.getInstance().getClubInLeague(leagueID);
    }

    sendRequestGetLeagueFormPlayer(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetLeagueFormPlayer(leagueID);
    }

    sendRequestGetLeagueRule(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetLeagueRule(leagueID);
    }

    sendRequestGetPlayerRecordItemList(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetPlayerRecordItemList(leagueID);
    }
    sendRequestUpdateLeagueFormPlayer(arrayId: string, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestUpdateLeagueFormPlayer(arrayId, leagueID);
    }
    sendRequestChangeStateClubInLeague(clubID: number, leagueID: number, state: number) {
        Bd69SFSConnector.getInstance().sendRequestChangeStateClubInLeague(clubID, leagueID, state);
    }
    sendRequestGetListPlayerFormInLeague(leagueID: number, clubID: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGetListPlayerFormInLeague(leagueID, clubID, page ? page : 0);
    }
    sendRequestGetPlayerFormInLeague(leagueID: number, playerID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetPlayerFormInLeague(leagueID, playerID);
    }
    sendRequestUpdatePlayerFormData(leagueID: number, data: any) {
        Bd69SFSConnector.getInstance().sendRequestUpdatePlayerFormData(leagueID, data);
    }
    sendRequestChangePlayerFormState(playerID: number, leagueID: number, state: number, data?: any) {
        Bd69SFSConnector.getInstance().sendRequestChangePlayerFormState(playerID, leagueID, state, data);
    }
    addPlayerIntoLeague(leagueID: number, clubID: number, arryPlayerID: number) {
        Bd69SFSConnector.getInstance().addPlayerIntoLeague(leagueID, clubID, arryPlayerID);
    }

    removePlayerFromLeague(leagueID: number, clubID: number, playerID: number) {
        Bd69SFSConnector.getInstance().removePlayerFromLeague(leagueID, clubID, playerID);
    }

    sendRequestGetPlayerInLeague(leagueID: number, clubID: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGetPlayerInLeague(leagueID, clubID, page ? page : 0);
    }

    sendRequestSearchStadium(searchQuery: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestSearchStadium(searchQuery, page ? page : 0);
    }

    sendRequestSearchDonor(searchQuery: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestSearchDonor(searchQuery, page ? page : 0);
    }

    sendRequestAddStadiumInLeague(stadiumId: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestAddStadiumInLeague(stadiumId, leagueID);
    }

    sendRequestRemoveStadiumInLeague(stadiumId: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveStadiumInLeague(stadiumId, leagueID);
    }
    sendRequestGetListStadiumInLeague(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetListStadiumInLeague(leagueID);
    }
    sendRequestAddLeagueManagerIntoLeague(userID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestAddLeagueManagerIntoLeague(userID, leagueID);
    }

    sendRequestGetListLeagueMangagerInLeague(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetListLeagueMangagerInLeague(leagueID);
    }

    sendRequestGetListDonorInLeague(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetListDonorInLeague(leagueID);
    }
    sendRequestRemoveLeagueManagerIntoLeague(userID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveLeagueManagerIntoLeague(userID, leagueID);
    }

    sendRequestAddDornorInLeague(dornorID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestAddDornorInLeague(dornorID, leagueID);
    }

    sendRequestRemoveDornorInLeague(dornorID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveDornorInLeague(dornorID, leagueID);
    }

    sendRequestRemoveRequestJoinLeague(leagueID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveRequestJoinLeague(leagueID, clubID);
    }

    sendRequestGetTableOfLeague(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetTableOfLeague(leagueID);
    }

    sendRequestUpdateLeagueTable(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestUpdateLeagueTable(leagueID);
    }

    sendRequestGetListMatchOfLeague(leagueID: number, clubID?: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGetListMatchOfLeague(leagueID, clubID ? clubID : null, page ? page : 0);
    }

    sendRequestADD_ROUND_INTO_LEAGUE(leagueID: number, rounds: Array<Rounds>) {
        Bd69SFSConnector.getInstance().sendRequestADD_ROUND_INTO_LEAGUE(leagueID, rounds);
    }

    sendRequestREMOVE_ROUND_FROM_LEAGUE(round: Rounds) {
        Bd69SFSConnector.getInstance().sendRequestREMOVE_ROUND_FROM_LEAGUE(round);
    }

    sendRequestUPDATE_LEAGUE_ROUND(round: Rounds) {
        Bd69SFSConnector.getInstance().sendRequestUPDATE_LEAGUE_ROUND(round);
    }

    sendRequestGET_LIST_ROUND_OF_LEAGUE(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGET_LIST_ROUND_OF_LEAGUE(leagueID);
    }

    sendRequestAddNewMatch(match: Match) {
        Bd69SFSConnector.getInstance().sendRequestAddNewMatch(match);
    }

    sendRequestDeleteMatch(matchID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestDeleteMatch(matchID, leagueID);
    }

    sendRequestUpdateMatchInfo(leagueID: number, info: Match) {
        Bd69SFSConnector.getInstance().sendRequestUpdateMatchInfo(leagueID, info);
    }

    sendRequestREMOVE_LEAGUE(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestREMOVE_LEAGUE(leagueID);
    }

    sendRequestGetListGroupOfLeague(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetListGroupOfLeague(leagueID);
    }

    sendRequestAddGroupIntoLeague(leagueID: number, groupName: string) {
        Bd69SFSConnector.getInstance().sendRequestAddGroupIntoLeague(leagueID, groupName);
    }

    sendRequestRemoveGroupFromLeague(leagueID: number, groupID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveGroupFromLeague(leagueID, groupID);
    }

    sendRequestUPDATE_GROUP_IN_LEAGUE(group: Group) {
        Bd69SFSConnector.getInstance().sendRequestUPDATE_GROUP_IN_LEAGUE(group);
    }

    sendRequestADD_CLUB_INTO_GROUP(clubID: number, leagueID: number, groupID: number) {
        Bd69SFSConnector.getInstance().sendRequestADD_CLUB_INTO_GROUP(clubID, leagueID, groupID);
    }

    sendRequestGetClubInLeagueInfo(clubID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetClubInLeagueInfo(clubID, leagueID);
    }
    sendRequestGetStadiumInfo(stadiumID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetStadiumInfo(stadiumID);
    }

    sendRequestRemoveClubFromLeague(clubID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveClubFromLeague(clubID, leagueID);
    }

    sendRequestGET_PLAYER_IN_LEAGUE_INFO(playerID: number, clubID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGET_PLAYER_IN_LEAGUE_INFO(playerID, clubID, leagueID);
    }
    sendRequestUpdatePlayersOfClubInMatch(matchID: number, leagueID: number, clubID: number, players: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdatePlayersOfClubInMatch(matchID, leagueID, clubID, players);
    }

    sendRequestLEAGUE_GET_LEAGUE_INFO(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LEAGUE_INFO(leagueID);
    }

    sendRequestLEAGUE_UPDATE_LEAGUE_INFO(leagueID: number, info: Leagues) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_LEAGUE_INFO(leagueID, info);
    }

    sendRequestLEAGUE_UPDATE_LEAGUE_LOGO(leagueID: number, logo: string) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_LEAGUE_LOGO(leagueID, logo);
    }

    sendRequestLEAGUE_UPDATE_LEAGUE_COVER(leagueID: number, cover: string) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_LEAGUE_COVER(leagueID, cover);
    }

    senRequestLEAGUE_CLUB_UPDATE_PLAYER_ROLE(leagueID: number, clubID: number, playerID: number, roleInClubInLeague){
        Bd69SFSConnector.getInstance().senRequestLEAGUE_CLUB_UPDATE_PLAYER_ROLE(leagueID, clubID, playerID, roleInClubInLeague);
    }

    sendRequestLEAGUE_ADD_CLUB(clubId: number, leagueID: number, managerID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_CLUB(clubId, leagueID, managerID);
    }
    sendRequestLEAGUE_REMOVE_CLUB(clubId: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_CLUB(clubId, leagueID);
    }
    sendRequestLEAGUE_UPDATE_CLUB_MANAGER(userID: number, clubId: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_CLUB_MANAGER(userID, clubId, leagueID);
    }
    sendRequestLEAGUE_GET_LIST_PLAYER(leagueID: number, clubId?: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_PLAYER(leagueID, clubId ? clubId : null, page ? page : null);
    }
    sendRequestLEAGUE_SEARCH_PLAYER(leagueID: number, searchQuery: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_PLAYER(leagueID, searchQuery, page ? page : null);
    }
    sendRequestLEAGUE_SEARCH_USER(leagueID: number, searchQuery: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_USER(leagueID, searchQuery, page ? page : null);
    }

    sendRequestLEAGUE_REMOVE_PLAYER_FROM_LEAGUE(playerID: number, leagueID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_PLAYER_FROM_LEAGUE(playerID, leagueID, clubID);
    }
    sendRequestLEAGUE_ADD_PLAYER_INTO_LEAGUE(playerID: number, leagueID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_PLAYER_INTO_LEAGUE(playerID, leagueID, clubID);
    }
    sendRequestLEAGUE_GET_LIST_REFEREE(leagueID: number, searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_REFEREE(leagueID, searchQuery, page);
    }
    sendRequestLEAGUE_ADD_REFEREE(refereeID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_REFEREE(refereeID, leagueID);
    }
    sendRequestLEAGUE_SEARCH_REFEREE(leagueID: number, searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_REFEREE(leagueID, searchQuery, page);
    }
    sendRequestLEAGUE_REMOVE_REFEREE(refereeID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_REFEREE(refereeID, leagueID);
    }
    // sendRequestLEAGUE_UPDATE_REFEREE_INFO(userID : number, leagueID: number){
    //     Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_REFEREE(userID, leagueID);
    // }

    //stadium
    sendRequestLEAGUE_GET_LIST_STATIDUM(leagueID: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_STATIDUM(leagueID, page);
    }
    sendRequestLEAGUE_ADD_STADIUM(leagueID: number, stadiumID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_STADIUM(leagueID, stadiumID);
    }
    sendRequestLEAGUE_REMOVE_STADIUM(leagueID: number, stadiumID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_STADIUM(leagueID, stadiumID);
    }
    sendRequestLEAGUE_SEARCH_STADIUM(leagueID: number, searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_STADIUM(leagueID, searchQuery, page);
    }
    sendRequestLEAGUE_GET_LIST_DORNOR(leagueID: number, searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(leagueID, searchQuery, page);
    }
    sendRequestLEAGUE_ADD_DORNOR(dornorID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_DORNOR(dornorID, leagueID);
    }
    sendRequestLEAGUE_SEARCH_DORNOR(leagueID: number, searchQuery?: string, page?:number){
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_DORNOR(leagueID, searchQuery? searchQuery: null, page? page : null);
    }
    sendRequestLEAGUE_REMOVE_DORNOR(dornorID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_DORNOR(dornorID, leagueID);
    }
    sendRequestLEAGUE_UPDATE_DORNOR_INFO(dornorID: number, leagueID: number, priority: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_DORNOR_INFO(dornorID, leagueID, priority);
    }

    // League Editor
    sendRequestLEAGUE_GET_LIST_EDITOR(leagueID: number, searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LIST_EDITOR(leagueID, searchQuery, page);
    }
    sendRequestLEAGUE_ADD_EDITOR(userID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_ADD_EDITOR(userID, leagueID);
    }
    sendRequestLEAGUE_SEARCH_EDITOR(leagueID: number, searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(leagueID, searchQuery, page);
    }
    sendRequestLEAGUE_REMOVE_EDITOR(userID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_REMOVE_EDITOR(userID, leagueID);
    }
    sendRequestLEAGUE_UPDATE_EDITOR_INFO(leagueID: number, userID: number, state: number) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_EDITOR_INFO(userID, leagueID, state);
    }
}