import { User, LeagueSearchUsers } from "../classes/user";
import { Clubs } from "../classes/clubs";
import { Bd69SFSConnector } from "../smartfox/bd69-sfs-connector";
import { Notification } from "../classes/notifications";
import { Dornor, DornorInLeague } from "../classes/donnor";
import { Player } from "../classes/player";
import { Leagues } from "../classes/league";
import { ParamsKey } from "../classes/paramkeys";
import { ClubInLeague } from "../classes/clubinleague";
import { RoleInClub, RoleInLeague } from "./constant-manager";

export class ManagerClubInLeagues {
    private mLeague: Leagues = new Leagues();
    private mClub: Clubs = new Clubs();

    constructor() { }

    public fromSFSObject(object: any) {
        if (object != null) {
            
            this.mLeague.fromSFSobject(object);

            if(object.containsKey(ParamsKey.CLUB)){
                this.mClub.fromSFSobject(object.getSFSObject(ParamsKey.CLUB));
            }
        }
    }

    public setLeague(league: Leagues) {
        this.mLeague = league;
    }

    public getLeague(): Leagues {
        return this.mLeague;
    }

    public setClub(club: Clubs) {
        this.mClub = club;
    }

    public getClub(): Clubs {
        return this.mClub;
    }
}

export class UserManager {

    mUser: User = new User();
    mNextPage: number = 0;

    mListUserNotifications: Array<Notification> = [];

    private mListManagerLeagues: Array<Leagues> = [];
    private mListManagerClubInLeagues: Array<ManagerClubInLeagues> = [];
    private mListManagerLeagueInLeagues: Array<Leagues> = [];

    private mClubInLeagueOfManager : Array<ClubInLeague> = [];
    private mListManagerCLubs: Array<Clubs> = [];
    private mListClubOfUser: Array<Clubs> = [];

    constructor() { }

    public onResponeUserListManager(sfsObject) {
        if (sfsObject) {
            if (sfsObject.containsKey(ParamsKey.EDITOR_IN_LEAGUES)) {
                this.onParseEditorInLeagues(sfsObject.getSFSArray(ParamsKey.EDITOR_IN_LEAGUES));
            }
            if (sfsObject.containsKey(ParamsKey.LEAGUES)) {
                this.onParseLeagues(sfsObject.getSFSArray(ParamsKey.LEAGUES));
            }
            if (sfsObject.containsKey(ParamsKey.CLUBS)) {
                this.onParseClubs(sfsObject.getSFSArray(ParamsKey.CLUBS));
            }
            if (sfsObject.containsKey(ParamsKey.CLUB_IN_LEAGUES)) {
                this.onParseClubInLeagues(sfsObject.getSFSArray(ParamsKey.CLUB_IN_LEAGUES));
                // this.onParseClubInLeaguesOfManager(sfsObject.getSFSArray(ParamsKey.CLUB_IN_LEAGUES));
            }
        }
    }

    public getClubManagerInLeagueByID(clubID : number): ManagerClubInLeagues{
        if(this.mListManagerClubInLeagues.length == 0) return null;
        for(let club of this.mListManagerClubInLeagues){
            if(club.getClub().getClubID() == clubID){
                return club;
            }
        }
        return null;
    }

    public getListClubOfUser(): Array<Clubs> {
        return this.mListClubOfUser;
    }

    public getListManagerLeagues() : Array<Leagues> {
        return this.mListManagerLeagues;
    }

    public getListManagerClubs(): Array<Clubs>{
        return this.mListManagerCLubs;
    }

    public getListManagerClubInLeague() : Array<ManagerClubInLeagues>{
        return this.mListManagerClubInLeagues;
    }

    public getListManagerLeagueInLeague() : Array<Leagues>  {
        return this.mListManagerLeagueInLeagues;
    }

    public getListClubInLeagueOfManager(): Array<ClubInLeague>{
        return this.mClubInLeagueOfManager;
    }

    onParseClubInLeague(sfsArray) : Array<ManagerClubInLeagues> {
        let array = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new ManagerClubInLeagues();
            newClub.fromSFSObject(sfsdata);
            array.push(newClub);
        }
        return array
    }

    onParseClubInLeagues(sfsArray) {
        if (!sfsArray) return;
        this.mListManagerClubInLeagues = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new ManagerClubInLeagues();
            newClub.fromSFSObject(sfsdata);
            this.mListManagerClubInLeagues.push(newClub);
        }
    }

    onParseClubInLeaguesOfManager(sfsArray) {
        if (!sfsArray) return;
        this.mClubInLeagueOfManager = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new ClubInLeague();
            newClub.onResponseUserManageClubInLeague(sfsdata);
            this.mClubInLeagueOfManager.push(newClub);
        }
    }

    onParseClubs(sfsArray) {
        if (!sfsArray) return;
        this.mListManagerCLubs = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new Clubs();
            newClub.fromSFSobject(sfsdata);
            this.mListManagerCLubs.push(newClub);
        }
    }

    onResponeClubOfUser(sfsArray){
        if (!sfsArray) return;
        this.mListClubOfUser = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new Clubs();
            newClub.fromSFSobject(sfsdata);
            this.mListClubOfUser.push(newClub);
        }
    }

    onParseLeagues(sfsArray) {
        if (sfsArray) {
            this.mListManagerLeagues = [];
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newLeague = new Leagues();
                newLeague.fromSFSobject(sfsdata);
                this.mListManagerLeagues.push(newLeague);
            }
        }
    }

    onParseEditorInLeagues(sfsArray) {
        if (sfsArray) {
            this.mListManagerLeagueInLeagues = [];
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newLeague = new Leagues();
                newLeague.fromSFSobject(sfsdata);
                this.mListManagerLeagueInLeagues.push(newLeague);
            }
        }
    }

    getUserNotification() {
        return this.mListUserNotifications;
    }

   
    onResponeNotification(sfsArray): Array<Notification> {
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newnotification = new Notification();
                newnotification.fromSFSObject(sfsdata);
                res.push(newnotification);
            }
        }
        return res;
    }


    onResponeDornorSFSArray(sfsArray): Array<Dornor> {
        let res: Array<Dornor> = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let data = sfsArray.getSFSObject(i);
                let newdornor = new Dornor();
                newdornor.fromSFSobject(data);
                res.push(newdornor);
            }
        }
        return res;
    }

    onResponeDornorInLeagueSFSArray(sfsArray): Array<DornorInLeague> {
        let res: Array<DornorInLeague> = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let data = sfsArray.getSFSObject(i);
                let newdornor = new DornorInLeague();
                newdornor.fromSFSObject(data);
                res.push(newdornor);
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

    onResponeLeagueSearchUserSFSArray(sfsArray): Array<LeagueSearchUsers> {
        let res: Array<LeagueSearchUsers> = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let data = sfsArray.getSFSObject(i);
                let newuser = new LeagueSearchUsers();
                newuser.fromSFSObject(data);
                res.push(newuser);
            }
        }
        return res;
    }

    onResponePlayerInLeagueSFSArray(sfsArray): Array<Player> {
        let res: Array<Player> = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let data = sfsArray.getSFSObject(i);
                let newPlayer = new Player();
                newPlayer.fromSFSObject(data);
                res.push(newPlayer);
            }
        }
        return res;
    }

    setUser(user: User) {
        this.mUser = user;
    }

    getUser(): User {
        return this.mUser;
    }

    getRoleOfUserInSystem(system_id?: any) {

    }

    getRoleOfUserInClub(club_id: number): number {
        let index = this.mListManagerCLubs.findIndex(club => {
            return club.getClubID() == club_id;
        });
        if(index > -1){
            return RoleInClub.MANAGER;
        }
    }

    getRoleOfUserInClubLeague(club_id: number): number {
        let index = this.mListManagerClubInLeagues.findIndex(club => {
            return club.getClub().getClubID() == club_id;
        });
        if(index > -1){
            return RoleInClub.MANAGER;
        }
    }

    getRoleOfUserInEditorLeague(league_id: number): number {
        let index = this.mListManagerLeagueInLeagues.findIndex(league => {
            return league.getLeagueID() == league_id;
        });
        if(index > -1) {
            return 1;
        }
    }

    getRoleOfUserInLeage(league_id: number) {

    }

    updateProfileInLeague(leagueId: number, profileId: number, params: any) {

    }

    updateInfo(params: any) {

    }

    sendRequestToJoinClub(club_id: number) {

    }

    sendRequestToCreateClub(params: Clubs) {
        Bd69SFSConnector.getInstance().sendRequestCreateClub(params);
    }

    sendRequestGetClubHaveRoleIsManager() {

        return null;
    }

    sendRequestSearchUser(searchQuery: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestSearchUser(searchQuery, page ? page : null);
    }

    sendRequestJoinClub(ClubID: number) {
        Bd69SFSConnector.getInstance().sendRequestJoinClub(ClubID);
    }

    getRequestJoinClubOfUser() {
        Bd69SFSConnector.getInstance().getRequestJoinClubOfUser();
    }

    getUserNotifications(page?: number) {
        Bd69SFSConnector.getInstance().getRequestUserNotifications(page ? page : null);
    }

    getRequestChangeStateNotification(notificationID: number, state: number) {
        Bd69SFSConnector.getInstance().getRequestChangeStateNotification(notificationID, state);
    }

    readNotification() {
        if (this.mUser.getUserStatistic().getNumberNotification() > 0) {
            Bd69SFSConnector.getInstance().readNotification();
        }
    }

    sendRequestUserInfo(userID?: number) {
        Bd69SFSConnector.getInstance().sendRequestUserInfo(userID);
    }

    sendRequestAddNewDornor(dornor: Dornor) {
        Bd69SFSConnector.getInstance().sendRequestAddNewDornor(dornor);
    }

    sendRequestGetStadiumInfo(stadiumID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetStadiumInfo(stadiumID);
    }
    sendRequestGetDornoInfo(dornorID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetDornoInfo(dornorID);
    }
    sendRequestGetLeagueInfo(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetLeagueInfo(leagueID);
    }
    sendRequestGetClubInfo(clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetClubInfo(clubID);
    }

    sendRequestGetPlayerInLeagueInfo(playerID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetPlayerInLeagueInfo(playerID, leagueID);
    }
    sendRequestGetClubInLeagueInfo(clubID: number, leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetClubInLeagueInfo(clubID, leagueID);
    }
    sendRequestGetPlayerInClubInfo(playerID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestGetPlayerInClubInfo(playerID, clubID);
    }

    sendRequestGetPlayerPositionList() {
        Bd69SFSConnector.getInstance().sendRequestGetPlayerPositionList();
    }

    sendRequestLogout() {
        Bd69SFSConnector.getInstance().sendRequestLogout();
        // Bd69SFSConnector.getInstance().disconnect();
    }

    sendRequestUpdateUserInfo(userID: number, avatar?: string, cover?: string, name?: string, birthday?: number, phone?: string, slogan?: string, description?: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateUserInfo(userID, avatar ? avatar : null, cover ? cover : null, name ? name : null, birthday ? birthday : null, phone ? phone : null, slogan ? slogan : null, description ? description : null);
    }

    getListLeagueOfClub(clubID: number) {
        Bd69SFSConnector.getInstance().getListLeagueOfClub(clubID);
    }

    getRequestJoinLeagueOfClub(leagueID: number, clubID: number) {
        Bd69SFSConnector.getInstance().getRequestJoinLeagueOfClub(leagueID, clubID);
    }



    sendRequestRemoveRequestJoinLeague(leagueID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveRequestJoinLeague(leagueID, clubID);
    }

    sendRequestRemoveRequestJoinClub(clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestRemoveRequestJoinClub(clubID);
    }

    sendRequestUpdateUserCover(userID: number, cover: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateUserCover(userID, cover);
    }

    sendRequestUpdateUserAvatar(userID: number, avatar: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateUserAvatar(userID, avatar);
    }

    sendRequestUpdateFacebookId(userID: number, facebookID: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateFacebookId(userID, facebookID);
    }

    sendRequestGET_LIST_RECORD_OF_PLAYER() {
        Bd69SFSConnector.getInstance().sendRequestGET_LIST_RECORD_OF_PLAYER();
    }

    sendRequestGET_USER_STATISTIC(userID: number) {
        Bd69SFSConnector.getInstance().sendRequestGET_USER_STATISTIC(userID);
    }
    sendRequestGetTopGoalInLeague(leagueID: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGetTopGoalInLeague(leagueID, page);
    }

    sendRequestGetTopCardInLeague(leagueID: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGetTopCardInLeague(leagueID, page);
    }
}   