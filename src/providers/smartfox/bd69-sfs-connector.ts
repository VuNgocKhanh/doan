import { Bd69SFSCmd } from "./bd69-sfs-cmd";
import { SFSConnector } from "../core/smartfox/sfs-connector";
import { SFSEvent } from "../core/smartfox/sfs-events";
import { ParamsKey } from "../classes/paramkeys";
import { LOGIN_TYPE, LeagueState } from "../manager/constant-manager";
import { Clubs } from "../classes/clubs";
import { Leagues } from "../classes/league";
import { JoinLeagueRequest } from "../classes/joinleaguerequest";
import { Dornor } from "../classes/donnor";
import { Rule } from "../classes/rule";
import { Match } from "../classes/matches";
import { MatchEvent } from "../classes/mathchevent";
import { Rounds } from "../classes/rounds";
import { Referee } from "../classes/referee";
import { Group } from "../classes/group";
import { ClubInLeague } from "../classes/clubinleague";
import { User } from "../classes/user";
import { Stadium } from "../classes/stadium";
import { Player } from "../classes/player";

var SFS2X = window['SFS2X'];

export class SFSUser {
    public static ROLE_PLAYER: number = 1;
    public static ROLE_CLUB_MANAGER: number = 3;
    public static ROLE_STADIUM_MANAGER: number = 2;


    username: string = "";
    password: string = "";
    role: number = -1;
    user_id: number = -1;
    phone: string = "";
    nick_name: string = "";

    constructor() {

    }

    onSFSUserInfoResponse(sfsObject) {
        if (sfsObject) {
            this.role = sfsObject.getInt('role');
            this.user_id = sfsObject.getInt('user_id');
            this.phone = sfsObject.getUtfString('phone');
            this.nick_name = sfsObject.getUtfString('nick_name');
        }
    }

    public getRole(): number {
        return this.role;
    }
}

export class Listener {
    name: string = "";
    method: any = () => { };
}

export class Bd69SFSConnector extends SFSConnector {


    mSFSUser: SFSUser = new SFSUser();
    public mSFSUserRoom;
    public mListeners: Map<string, any> = new Map<string, any>();
    mPingIntervalID = -1;
    public addListener(key: string, func: any): void {
        this.mListeners.set(key, func);
    }

    public removeListener(key: string): void {
        this.mListeners.delete(key);
    }

    public removeAllListener(): void {
        this.mListeners.clear();
    }

    public dispatchEvent(event): void {
        this.mListeners.forEach((val, key) => {
            val(event);
        });
    }

    public getSessionToken() {
        return this.mSFSClient.sessionToken;
    }


    private static _instance: Bd69SFSConnector = null;
    private constructor() {
        super();
    }
    public static getInstance(): Bd69SFSConnector {
        if (this._instance == null) {
            this._instance = new Bd69SFSConnector();
        }
        return this._instance;
    }

    public getSFSUser(): SFSUser {
        return this.mSFSUser;
    }

    public setData(data): void {
        super.setData(data);
        this.onResponseDataConfig(data);
    }

    private onResponseDataConfig(data): void {
        if (!data) return;
        if ('smartfox_server' in data) {
            let serverConfig = data[data['smartfox_server']];
            if (serverConfig) {
                if ('host' in serverConfig) this.setSFSHost(serverConfig['host']);
                if ('port' in serverConfig) this.setSFSPort(serverConfig['port']);
                if ('zone' in serverConfig) this.setSFSZone(serverConfig['zone']);
                if ('debug' in serverConfig) this.setSFSDebug(serverConfig['debug']);
            }
        }
    }

    public loginByFacebook(facebook_id: string, name: string, avatar: string) {
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }

        return new Promise((resolve, reject) => {
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN, () => { });
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN_ERROR, () => { });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN, (eventParams) => {
                return resolve(eventParams);
            });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN_ERROR, (eventParams) => {
                return reject(eventParams);
            });
            let params = new SFS2X.SFSObject();
            params.putInt(ParamsKey.LOGIN_TYPE, LOGIN_TYPE.FACEBOOK);
            params.putUtfString(ParamsKey.FACEBOOK_ID, facebook_id);
            params.putUtfString(ParamsKey.NAME, name);
            params.putUtfString(ParamsKey.AVATAR, avatar);

            this.mSFSClient.send(new SFS2X.LoginRequest(facebook_id, "", params, this.getSFSZone()));

            console.log("params.." , params.getDump());
            
        })
    }

    public loginByPhoneNumber(phone: string, name: string, avatar?: string) {
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }
        return new Promise((resolve, reject) => {
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN, () => { });
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN_ERROR, () => { });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN, (eventParams) => {
                return resolve(eventParams);
            });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN_ERROR, (eventParams) => {
                return reject(eventParams);
            });
            let params = new SFS2X.SFSObject();
            params.putInt(ParamsKey.LOGIN_TYPE, LOGIN_TYPE.PHONE);
            params.putUtfString(ParamsKey.NAME, name);
            params.putUtfString(ParamsKey.PHONE, phone);
            if (avatar) params.putUtfString(ParamsKey.AVATAR, avatar);

            this.mSFSClient.send(new SFS2X.LoginRequest(phone, "", params, this.getSFSZone()));
        })
    }

    public sendInformationDeviceToServer(oneSignalID: string, deviceName: string, deviecPlatform: number): void {
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DEVICE_PLATFORM, deviecPlatform);
        params.putUtfString(ParamsKey.DEVICE_NAME, deviceName);
        params.putUtfString(ParamsKey.ONESIGNAL_ID, oneSignalID);


        this.send("bd69." + Bd69SFSCmd.UPDATE_LOGIN_DEVICE, params);
    }


    public addListenerForExtensionResponse() {

        this.mSFSClient.removeEventListener(SFSEvent.EXTENSION_RESPONSE, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_RESUME, () => { });

        this.mSFSClient.addEventListener(SFSEvent.EXTENSION_RESPONSE, (eventParams) => {
            this.onExtensionResponse(eventParams);
        });

        this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (eventParams) => {
            var eventsP = {
                cmd: Bd69SFSCmd.CONNECTION_LOST,
                params: new SFS2X.SFSObject()
            }
            this.onExtensionResponse(eventsP);
        });

        this.mSFSClient.addEventListener(SFSEvent.CONNECTION_RESUME, (eventParams) => {
            var eventsP = {
                cmd: SFSEvent.CONNECTION_RESUME,
                params: new SFS2X.SFSObject()
            }
            this.onExtensionResponse(eventsP);
        });
    }

    public onExtensionResponse(eventParams) {
        if (this.mDebug) {
            console.log("EXTENSION_RESPONSE : " + eventParams.cmd, eventParams.params.getDump());
        }
        this.dispatchEvent(eventParams);
    }
    private sendRoom(cmd: string, params): void {
        this.mSFSClient.send(new SFS2X.ExtensionRequest(cmd, params, this.mSFSUserRoom));
    }

    requestJoinRoom(roomName: string) {
        this.mSFSUserRoom = roomName;
        return new Promise((resolve, reject) => {
            this.mSFSClient.removeEventListener(SFSEvent.ROOM_JOIN, () => { });
            this.mSFSClient.removeEventListener(SFSEvent.ROOM_JOIN_ERROR, () => { });
            this.mSFSClient.addEventListener(SFSEvent.ROOM_JOIN, (eventParams) => {
                return resolve(eventParams);
            });
            this.mSFSClient.addEventListener(SFSEvent.ROOM_JOIN_ERROR, (eventParams) => {
                return reject(eventParams);
            });
            this.mSFSClient.send(new SFS2X.JoinRoomRequest(roomName));
        });
    }

    sendRequestUserInfo(userID?: number) {
        let params = new SFS2X.SFSObject();
        if (userID) params.putInt(ParamsKey.USER_ID, userID);
        this.send("bd69." + Bd69SFSCmd.GET_USER_INFO, params);
    }


    sendRequestCreateClub(club: Clubs) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.NAME, club.getName());
        if (club.getSlogan()) params.putUtfString(ParamsKey.SLOGAN, club.getSlogan());
        if (club.getDescription()) params.putUtfString(ParamsKey.DESCRIPTION, club.getDescription());
        if (club.getLogo()) params.putUtfString(ParamsKey.LOGO, club.getLogo());
        if (club.getCover()) params.putUtfString(ParamsKey.COVER, club.getCover());

        this.send("bd69." + Bd69SFSCmd.CREATE_CLUB, params);
    }


    sendRequestAddStadiumInLeague(stadiumID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        this.send("bd69." + Bd69SFSCmd.ADD_STADIUM_INTO_LEAGUE, params);
    }

    sendRequestRemoveStadiumInLeague(stadiumID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        this.send("bd69." + Bd69SFSCmd.REMOVE_STADIUM_FROM_LEAGUE, params);
    }


    sendRequestSearchClub(searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);

        console.log("params search club ", params.getDump());
        this.send("bd69." + Bd69SFSCmd.SEARCH_CLUB, params);
    }

    sendRequestSearchLeague(searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);

        this.send("bd69." + Bd69SFSCmd.SEARCH_LEAGUE, params);
    }

    sendRequestSearchUser(searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        //  console.log("params search user", params.getDump());

        this.send("bd69." + Bd69SFSCmd.SEARCH_USER, params);
    }

    sendRequestSearchStadium(searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        //  console.log("params search stadium", params.getDump());
        this.send("bd69." + Bd69SFSCmd.SEARCH_STADIUM, params);
    }

    sendRequestAPP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN(userID?: number, page?: number) {
        let params = new SFS2X.SFSObject();
        if (userID) params.putInt(ParamsKey.USER_ID, userID);
        params.putInt(ParamsKey.PAGE, page ? page : 0);

        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN, params);
    }

    sendRequestSearchDonor(searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        //  console.log("params search donor", params.getDump());
        this.send("bd69." + Bd69SFSCmd.SEARCH_DORNOR, params);
    }

    sendRequestSearchAll(searchQuery: string) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        //  console.log("params search all", params.getDump());
        this.send("bd69." + Bd69SFSCmd.SEARCH_ALL, params);
    }

    sendRequestGetClubOfUser(playerID?: number) {
        let params = new SFS2X.SFSObject();
        if(playerID) params.putInt(ParamsKey.PLAYER_ID, playerID)
        this.send("bd69." + Bd69SFSCmd.GET_CLUB_OF_USER, params);
    }


    sendRequestGetUserInClub(clubID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PAGE, page ? page : 0)
        this.send("bd69." + Bd69SFSCmd.GET_USER_IN_CLUB, params);
    }
    sendRequestGetLeagueOfUser() {
        let params = new SFS2X.SFSObject();
        this.send("bd69." + Bd69SFSCmd.GET_LEAGUE_OF_USER, params);
    }

    sendRequestSearchPlayerInClub(searchQuery: string, clubID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        this.send("bd69." + Bd69SFSCmd.SEARCH_PLAYER_IN_CLUB, params);

    }

    sendRequestSearchPlayerInLeague(searchQuery: string, leagueID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        this.send("bd69." + Bd69SFSCmd.SEARCH_PLAYER_IN_LEAGUE, params);
    }

    sendRequestJoinClub(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        this.send("bd69." + Bd69SFSCmd.REQUEST_JOIN_CLUB, params);
    }

    getRequestJoinClub(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        this.send("bd69." + Bd69SFSCmd.GET_REQUEST_JOIN_OF_CLUB, params);
    }

    getRequestJoinClubOfUser() {
        let params = new SFS2X.SFSObject();
        this.send("bd69." + Bd69SFSCmd.GET_REQUEST_JOIN_CLUB_OF_USER, params);
    }

    getRequestUserNotifications(page?: number) {
        let params = new SFS2X.SFSObject();
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.GET_REQUEST_USER_NOTIFICATION, params);
    }

    getRequestChangeStateNotification(notificationID: number, state: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.NOTIFICATION_ID, notificationID);
        params.putInt(ParamsKey.STATE, state);
        this.send("bd69." + Bd69SFSCmd.CHANGE_NOTIFICATION_STATE, params);
    }

    sendRequestAddUserIntoClub(userID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        this.send("bd69." + Bd69SFSCmd.ADD_USER_INTO_CLUB, params);
    }

    processRequestJoinClub(clubID: number, userID: number, state: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.USER_ID, userID);
        params.putInt(ParamsKey.STATE, state);
        //  console.log("params ", params.getDump());

        this.send("bd69." + Bd69SFSCmd.PROCESS_REQUEST_JOIN_CLUB, params);
    }

    sendRequestLeaveClub(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        this.send("bd69." + Bd69SFSCmd.LEAVE_CLUB, params);
    }

    sendRequestKickPlayer(clubID: number, playerID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        this.send("bd69." + Bd69SFSCmd.REMOVE_USER_OF_CLUB, params);
    }

    sendRequestChangeRole(clubID: number, playerID: number, role: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        params.putInt(ParamsKey.ROLE, role);
        this.send("bd69." + Bd69SFSCmd.CHANGE_USER_ROLE_IN_CLUB, params)

    }
    sendRequestCreateNewLeague(newLeague: Leagues) {
        let params = new SFS2X.SFSObject();
        console.log(newLeague);

        params.putUtfString(ParamsKey.NAME, newLeague.getName());
        params.putInt(ParamsKey.TYPE, parseInt(newLeague.getType() + ""));
        if (newLeague.getNumberClub() > -1) params.putInt(ParamsKey.NUMBER_CLUB, newLeague.getNumberClub());
        if (newLeague.getTimeStart()) params.putLong(ParamsKey.TIME_START, newLeague.getTimeStart());
        if (newLeague.getTimeEnd()) params.putLong(ParamsKey.TIME_END, newLeague.getTimeEnd());
        //  console.log("params create league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.CREATE_LEAGUE, params);
    }

    sendRequestJoinLeague(param: JoinLeagueRequest) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, param.getLeagueID());
        if (param.getLeaderID()) params.putInt(ParamsKey.LEADER_ID, param.getLeaderID());
        params.putInt(ParamsKey.CLUB_ID, param.getClubID());
        params.putUtfString(ParamsKey.SHOWMAN, param.getShowman());
        //  console.log("params request join league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.REQUEST_JOIN_LEAGUE, params);
    }

    sendRequestGetLeagueList(page?: number, state?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        if (state) params.putInt(ParamsKey.STATE, state);
        //  console.log("params request list league", params.getDump());

        this.send("bd69." + Bd69SFSCmd.GET_LEAGUE_LIST, params);
    }

    getRequestJoinOfLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //  console.log("params list request join league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_REQUEST_JOIN_OF_LEAGUE, params);
    }

    processRequestJoinLeague(leagueID: number, clubID: number, state: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.STATE, state);
        //  console.log("params process request join league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.PROCESS_REQUEST_JOIN_LEAGUE, params);
    }

    addClubIntoLeague(param: JoinLeagueRequest) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, param.getLeagueID());
        params.putInt(ParamsKey.LEADER_ID, param.getLeaderID());
        params.putInt(ParamsKey.CLUB_ID, param.getClubID());
        params.putUtfString(ParamsKey.SHOWMAN, param.getShowman());
        //  console.log("params add club into league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_CLUB_INTO_LEAGUE, params);
    }

    getClubInLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //  console.log("params list club in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_CLUB_IN_LEAGUE, params);
    }

    sendRequestRemoveClubFromLeague(clubID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //  console.log("params remove club from league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_CLUB_FROM_LEAGUE, params);
    }

    removeLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //  console.log("params remove league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_LEAGUE, params);
    }

    sendRequestGetLeagueRule(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //  console.log("params get league rule", params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LEAGE_RULE, params);
    }

    sendRequestGetLeagueFormPlayer(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //  console.log("params get league form player", params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LEAGUE_FORM_PLAYER, params);
    }

    sendRequestGetPlayerRecordItemList(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //  console.log("params get league form player", params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_PLAYER_RECORD_ITEM_LIST, params);
    }

    sendRequestUpdateLeagueFormPlayer(arrayId: string, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.ITEMS, arrayId);
        //  console.log("params update league form player", params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_LEAGUE_FORM_PLAYER, params);
    }

    sendRequestChangeStateClubInLeague(clubID: number, leagueID: number, state: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.STATE, state);

        //  console.log("params change club state in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.CHANGE_CLUB_STATE_IN_LEAGUE, params);
    }

    sendRequestGetListPlayerFormInLeague(leagueID: number, clubID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        if (page) params.putInt(ParamsKey.PAGE, page);

        //  console.log("params get list form player in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_PLAYER_FORM_IN_LEAGUE, params);
    }

    sendRequestChangePlayerFormState(playerID: number, leagueID: number, state: number, data?: any) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        params.putInt(ParamsKey.STATE, state);
        if (data) params.putUtfString(ParamsKey.DATA, data);
        //  console.log("params get list form player in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.CHANGE_PLAYER_FORM_STATE, params);
    }

    sendRequestUpdatePlayerFormData(leagueID: number, data: any) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (data) params.putUtfString(ParamsKey.DATA, data);

        //  console.log("params get list form player in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_PLAYER_FORM_DATA, params);
    }

    sendRequestLEAGUE_UPDATE_PLAYER_FORM_DATA(leagueID: number,playerID: number, data: any) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        if (data) params.putUtfString(ParamsKey.DATA, data);

        //  console.log("params get list form player in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_PLAYER_FORM_DATA, params);
    }

    sendRequestLEAGUE_CLUB_UPDATE_PLAYER_FORM_DATA(clubID: number,leagueID: number,playerID: number, data: any) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        if (data) params.putUtfString(ParamsKey.DATA, data);

        //  console.log("params get list form player in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_UPDATE_PLAYER_FORM_DATA, params);
    }

    sendRequestGetPlayerFormInLeague(leagueID: number, playerID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);

        //  console.log("params get player form in league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_PLAYER_FORM_IN_LEAGUE, params);
    }

    sendRequestAddLeagueManagerIntoLeague(userID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.USER_ID, userID);

        //   console.log("cmd", Bd69SFSCmd.ADD_MANAGER_INTO_LEAGUE + "params", params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_MANAGER_INTO_LEAGUE, params);
    }

    sendRequestRemoveLeagueManagerIntoLeague(userID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.USER_ID, userID);

        //   console.log("cmd", Bd69SFSCmd.ADD_MANAGER_INTO_LEAGUE + "params", params.getDump());

        this.send("bd69." + Bd69SFSCmd.REMOVE_MANAGER_FROM_LEAGUE, params);
    }

    sendRequestGetListLeagueMangagerInLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //  console.log("params get player form in league", params.getDump());

        this.send("bd69." + Bd69SFSCmd.GET_LIST_MANAGER_OF_LEAGUE, params);
    }


    getLeagueRule() {
        let params = new SFS2X.SFSObject();

    }

    updateLeagueRule() {
        let params = new SFS2X.SFSObject();

    }

    sendRequestGetPlayerInLeague(leagueID: number, clubID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        if (page) params.putInt(ParamsKey.PAGE, page);
        //  console.log("params get player in league", params.getDump());

        this.send("bd69." + Bd69SFSCmd.GET_USER_IN_LEAGUE, params);
    }

    addPlayerIntoLeague(leagueID: number, clubID: number, playerID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        this.send("bd69." + Bd69SFSCmd.ADD_PLAYER_INTO_LEAGUE, params);
    }

    removePlayerFromLeague(leagueID: number, clubID: number, playerID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        //  console.log("params remove player from league", params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_PLAYER_FROM_LEAGUE, params);
    }

    readNotification() {
        let params = new SFS2X.SFSObject();
        this.send("bd69." + Bd69SFSCmd.READ_NOTIFICATION, params);
    }

    sendRequestGetListStadiumInLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.GET_LIST_STADIUM_IN_LEAGUE, params);
    }

    sendRequestGetListDonorInLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.GET_LIST_DORNOR_IN_LEAGUE, params);

    }

    sendRequestGET_LIST_DORNOR(page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        this.send("bd69." + Bd69SFSCmd.GET_LIST_DORNOR, params);

    }

    sendRequestAddNewDornor(dornor: Dornor) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.NAME, dornor.getName());
        if (dornor.getDescription()) params.putUtfString(ParamsKey.DESCRIPTION, dornor.getDescription());
        if (dornor.getWebsite()) params.putUtfString(ParamsKey.WEBSITE, dornor.getWebsite());
        if (dornor.getFacebook()) params.putUtfString(ParamsKey.FACEBOOK, dornor.getFacebook());
        if (dornor.getYoutube()) params.putUtfString(ParamsKey.YOUTUBE, dornor.getYoutube());

        //   console.log("cmd" + Bd69SFSCmd.ADD_NEW_DORNOR, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_NEW_DORNOR, params);
    }

    sendRequestAddDornorInLeague(dornorID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.DORNOR_ID, dornorID);

        //   console.log("cmd" + Bd69SFSCmd.ADD_DORNOR_INTO_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_DORNOR_INTO_LEAGUE, params);
    }

    sendRequestRemoveDornorInLeague(dornorID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.DORNOR_ID, dornorID);

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_DORNOR_FROM_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_DORNOR_FROM_LEAGUE, params);
    }

    sendRequestGetClubInfo(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);

        //   console.log("cmd" + Bd69SFSCmd.GET_CLUB_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_CLUB_INFO, params);
    }

    sendRequestGetLeagueInfo(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_LEAGUE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LEAGUE_INFO, params);
    }

    sendRequestGetDornoInfo(dornorID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);

        //   console.log("cmd" + Bd69SFSCmd.GET_DORNOR_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_DORNOR_INFO, params);
    }

    sendRequestGetStadiumInfo(stadiumID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);

        //   console.log("cmd" + Bd69SFSCmd.GET_STADIUM_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_STADIUM_INFO, params);
    }

    sendRequestGetPlayerInLeagueInfo(playerID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_PLAYER_IN_LEAGUE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_PLAYER_IN_LEAGUE_INFO, params);
    }
    sendRequestGetClubInLeagueInfo(clubID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);


        //   console.log("cmd" + Bd69SFSCmd.GET_CLUB_IN_LEAGUE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_CLUB_IN_LEAGUE_INFO, params);
    }
    sendRequestGetPlayerInClubInfo(playerID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);

        //   console.log("cmd" + Bd69SFSCmd.GET_PLAYER_IN_CLUB_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_PLAYER_IN_CLUB_INFO, params);
    }

    sendRequestGetPlayerPositionList() {
        let params = new SFS2X.SFSObject();

        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_PLAY_POSITION, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_PLAY_POSITION, params);
    }

    sendRequestGET_LIST_RECORD_OF_PLAYER() {
        let params = new SFS2X.SFSObject();

        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_RECORD_OF_PLAYER, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_RECORD_OF_PLAYER, params);
    }

    sendRequestUpdateLeagueRule(rule: Rule) {
        let params = rule.toSFSObject();
        //   console.log("cmd" + Bd69SFSCmd.UPDATE_LEAGUE_RULE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_LEAGUE_RULE, params);
    }

    sendRequestUpdateLeagueLogo(leagueID: number, logo: string) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.LEAGUE_ID, leagueID);
        obj.putUtfString(ParamsKey.LOGO, logo);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_LEAGUE_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_LEAGUE_INFO, obj);
    }

    sendRequestUpdateUserAvatar(userID: number, avatar: string) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.USER_ID, userID);
        obj.putUtfString(ParamsKey.AVATAR, avatar);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_USER_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_USER_INFO, obj);
    }

    sendRequestUpdateFacebookId(userID: number, facebookID: string) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.USER_ID, userID);
        obj.putUtfString(ParamsKey.FACEBOOK_ID, facebookID);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_USER_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_USER_INFO, obj);
    }

    sendRequestUpdateUserCover(userID: number, cover: string) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.USER_ID, userID);
        obj.putUtfString(ParamsKey.COVER, cover);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_USER_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_USER_INFO, obj);
    }

    sendRequestUpdateLeagueCover(leagueID: number, cover: string) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.LEAGUE_ID, leagueID);
        obj.putUtfString(ParamsKey.COVER, cover);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_LEAGUE_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_LEAGUE_INFO, obj);
    }

    sendRequestUpdateClubCover(clubID: number, cover: string) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.CLUB_ID, clubID);
        obj.putUtfString(ParamsKey.COVER, cover);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_CLUB_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_CLUB_INFO, obj);
    }

    sendRequestUpdateClubLogo(clubID: number, logo: string) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.CLUB_ID, clubID);
        obj.putUtfString(ParamsKey.LOGO, logo);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_CLUB_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_CLUB_INFO, obj);
    }

    sendRequestUpdateLeagueInfo(league: Leagues) {
        let obj = new SFS2X.SFSObject();

        obj.putInt(ParamsKey.LEAGUE_ID, league.getLeagueID());
        obj.putInt(ParamsKey.TYPE, parseInt(league.getType() + ""));
        if (league.getName()) obj.putUtfString(ParamsKey.NAME, league.getName());
        if (league.getDescription()) obj.putUtfString(ParamsKey.DESCRIPTION, league.getDescription());
        if (league.getNumberClub() > 0) obj.putInt(ParamsKey.NUMBER_CLUB, league.getNumberClub());
        if (league.getTimeStart() > 0) obj.putLong(ParamsKey.TIME_START, league.getTimeStart());
        if (league.getTimeEnd() > 0) obj.putLong(ParamsKey.TIME_END, league.getTimeEnd());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_LEAGUE_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_LEAGUE_INFO, obj);
    }

    sendRequestUpdateUserInfo(userID: number, avatar?: string, cover?: string, name?: string, birthday?: number, phone?: string, slogan?: string, description?: string) {
        let params = new SFS2X.SFSObject();
        console.log(birthday);

        params.putInt(ParamsKey.USER_ID, userID);
        if (avatar) params.putUtfString(ParamsKey.AVATAR, avatar);
        if (cover) params.putUtfString(ParamsKey.COVER, cover);
        if (name) params.putUtfString(ParamsKey.NAME, name);
        if (birthday) params.putLong(ParamsKey.BIRTHDAY, birthday);
        if (phone) params.putUtfString(ParamsKey.PHONE, phone);
        if (slogan) params.putUtfString(ParamsKey.SLOGAN, slogan);
        if (description) params.putUtfString(ParamsKey.DESCRIPTION, description);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_USER_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_USER_INFO, params);
    }

    sendRequestUpdateClubInfo(clubID: number, name?: string, description?: string, slogan?: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        if (name) params.putUtfString(ParamsKey.NAME, name);
        if (description) params.putUtfString(ParamsKey.DESCRIPTION, description);
        if (slogan) params.putUtfString(ParamsKey.SLOGAN, slogan);
        // if(logo) params.putUtfString(ParamsKey.LOGO, logo);
        // if(cover) params.putUtfString(ParamsKey.COVER, cover);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_CLUB_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_CLUB_INFO, params);
    }




    sendRequestLogout() {
        let params = new SFS2X.SFSObject();
        this.send("bd69." + Bd69SFSCmd.USER_LOGOUT, params);
    }

    getListLeagueOfClub(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);

        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_LEAGUE_OF_CLUB, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_LEAGUE_OF_CLUB, params);
    }

    getRequestJoinLeagueOfClub(leagueID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);

        //   console.log("cmd" + Bd69SFSCmd.GET_REQUEST_JOIN_LEAGUE_OF_CLUB, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_REQUEST_JOIN_LEAGUE_OF_CLUB, params);
    }

    sendRequestRemoveRequestJoinLeague(leagueID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_REQUEST_JOIN_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_REQUEST_JOIN_LEAGUE, params);
    }

    sendRequestRemoveRequestJoinClub(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_REQUEST_JOIN_CLUB, params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_REQUEST_JOIN_CLUB, params);
    }

    sendRequestGetTableOfLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_TABLE_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_TABLE_OF_LEAGUE, params);
    }

    sendRequestUpdateLeagueTable(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_LEAGUE_TABLE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_LEAGUE_TABLE, params);
    }

    sendRequestGetListGroupOfLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_GROUP_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_GROUP_OF_LEAGUE, params);

    }

    sendRequestGetTopGoalOfLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_TOP_GOAL_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_TOP_GOAL_OF_LEAGUE, params);
    }

    sendRequestGetTopCardOfLeague(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_TOP_CARD_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_TOP_CARD_OF_LEAGUE, params);
    }

    sendRequestGetListMatchOfLeague(leagueID: number, clubID?: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (clubID) params.putInt(ParamsKey.CLUB_ID, clubID);
        if (page) params.putInt(ParamsKey.PAGE, page);

        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_MATCH_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_MATCH_OF_LEAGUE, params);
    }

    sendRequestGetListMatchOfClub(clubID: number) {
        let params = new SFS2X.SFSObject();
        // params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);

        // console.log("cmd" + Bd69SFSCmd.GET_LIST_MATCH_OF_CLUB, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_MATCH_OF_CLUB, params);
    }

    sendRequestGetListClubOfManager(){
        let params = new SFS2X.SFSObject();
        // params.getInt(ParamsKey.USER_ID, userID);
        this.send("bd69." + Bd69SFSCmd.GET_LIST_MANAGE, params);
    }

    sendRequestAddNewMatch(match: Match) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.ROUND_ID, match.getRoundID());
        params.putInt(ParamsKey.HOME_ID, match.getHomeID());
        params.putInt(ParamsKey.AWAY_ID, match.getAwayID());
        params.putInt(ParamsKey.LEAGUE_ID, match.getLeagueID());
        if (match.getDuration() > 0) params.putInt(ParamsKey.DURATION, parseInt(match.getDuration() + ""));
        if (match.getTimeStart() > 0) params.putLong(ParamsKey.TIME_START, match.getTimeStart());
        if (match.getStadiumID() > -1) params.putInt(ParamsKey.STADIUM_ID, match.getStadiumID());
        //   console.log("cmd" + Bd69SFSCmd.ADD_NEW_MATCH, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_NEW_MATCH, params);
    }

    sendRequestDeleteMatch(matchID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.DELETE_MATCH, params.getDump());
        this.send("bd69." + Bd69SFSCmd.DELETE_MATCH, params);
    }

    sendRequestUPDATE_MATCH_RESULT(match: Match) {
        let params = new SFS2X.SFSObject();

        params.putInt(ParamsKey.MATCH_ID, match.getMatchID());
        params.putInt(ParamsKey.LEAGUE_ID, match.getLeagueID());
        params.putInt(ParamsKey.HOME_GOAL, parseInt(match.getHomeGoal() + ""));
        params.putInt(ParamsKey.AWAY_GOAL, parseInt(match.getAwayGoal() + ""));

        // console.log("cmd " + Bd69SFSCmd.UPDATE_MATCH_RESULT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_MATCH_RESULT, params);
    }

    sendRequestUpdateHomeGoal(match: Match) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, match.getHomeID());
        params.putInt(ParamsKey.MATCH_ID, match.getMatchID());
        params.putInt(ParamsKey.LEAGUE_ID, match.getLeagueID());
        params.putInt(ParamsKey.GOAL, parseInt(match.getHomeGoal() + ""));

        // console.log("cmd " + Bd69SFSCmd.UPDATE_CLUB_IN_MATCH, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_CLUB_IN_MATCH, params);
    }

    sendRequestUpdatePlayersOfClubInMatch(matchID: number, leagueID: number, clubID: number, players: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putUtfString(ParamsKey.PLAYERS, players);

        // console.log("cmd " + Bd69SFSCmd.UPDATE_CLUB_IN_MATCH, params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_CLUB_IN_MATCH, params);
    }



    sendRequestUpdateAwayGoal(match: Match) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, match.getAwayID());
        params.putInt(ParamsKey.MATCH_ID, match.getMatchID());
        params.putInt(ParamsKey.LEAGUE_ID, match.getLeagueID());
        params.putInt(ParamsKey.GOAL, parseInt(match.getAwayGoal() + ""));

        console.log("cmd " + Bd69SFSCmd.UPDATE_CLUB_IN_MATCH, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_CLUB_IN_MATCH, params);
    }

    sendRequestUpdateMatchInfo(leagueID: number, info: Match) {
        let obj = new SFS2X.SFSObject();

        obj.putInt(ParamsKey.LEAGUE_ID, leagueID);
        obj.putInt(ParamsKey.MATCH_ID, info.getMatchID());
        obj.putInt(ParamsKey.DURATION, parseInt(info.getDuration() + ""));
        obj.putLong(ParamsKey.TIME_START, info.getTimeStart());
        obj.putInt(ParamsKey.STADIUM_ID, info.getStadiumID());
        obj.putInt(ParamsKey.ROUND_ID, info.getRoundID());
        //   console.log("cmd" + Bd69SFSCmd.UPDATE_MATCH_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_MATCH_INFO, obj);
    }

    sendRequestUpdateMatchPlayers(matchID: number, leagueID: number, players: string, substitues: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MATCH_ID, matchID);

        params.putUtfString(ParamsKey.PLAYERS, players);
        params.putUtfString(ParamsKey.SUBSTITUES, substitues);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_MATCH_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_MATCH_INFO, params);
    }

    sendRequestMatchKickOff(matchevent: MatchEvent) {
        let params = new SFS2X.SFSObject();

        params.putInt(ParamsKey.LEAGUE_ID, matchevent.getLeagueID());
        params.putInt(ParamsKey.MATCH_ID, matchevent.getMatchID());
        params.putInt(ParamsKey.TYPE, matchevent.getType());
        params.putInt(ParamsKey.TIME, matchevent.getTime());
        params.putUtfString(ParamsKey.NAME, matchevent.getName());

        //   console.log("cmd" + Bd69SFSCmd.ADD_MATCH_KICK_OFF, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_MATCH_KICK_OFF, params);
    }

    sendRequestAddMatchEvent(matchevent: MatchEvent) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, matchevent.getLeagueID());
        params.putInt(ParamsKey.MATCH_ID, matchevent.getMatchID());
        params.putInt(ParamsKey.TYPE, matchevent.getType());
        params.putUtfString(ParamsKey.NAME, matchevent.getName());

        if (matchevent.getTime()) params.putInt(ParamsKey.TIME, matchevent.getTime());
        if (matchevent.getClubID()) params.putInt(ParamsKey.CLUB_ID, matchevent.getClubID());
        if (matchevent.getPlayerID1()) params.putInt(ParamsKey.PLAYER_ID_1, matchevent.getPlayerID1());
        if (matchevent.getPlayerID2()) params.putInt(ParamsKey.PLAYER_ID_2, matchevent.getPlayerID2());
        if (matchevent.getDescription()) params.putUtfString(ParamsKey.DESCRIPTION, matchevent.getDescription());

        //   console.log("cmd" + Bd69SFSCmd.ADD_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_MATCH_EVENT, params);
    }

    sendRequestLEAGUE_ADD_NEW_MATCH_EVENT(matchevent: MatchEvent) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, matchevent.getLeagueID());
        params.putInt(ParamsKey.MATCH_ID, matchevent.getMatchID());
        params.putInt(ParamsKey.TYPE, matchevent.getType());
        params.putUtfString(ParamsKey.NAME, matchevent.getName());

        if (matchevent.getTime()) params.putInt(ParamsKey.TIME, matchevent.getTime());
        if (matchevent.getClubID()) params.putInt(ParamsKey.CLUB_ID, matchevent.getClubID());
        if (matchevent.getPlayerID1()) params.putInt(ParamsKey.PLAYER_ID_1, matchevent.getPlayerID1());
        if (matchevent.getPlayerID2()) params.putInt(ParamsKey.PLAYER_ID_2, matchevent.getPlayerID2());
        if (matchevent.getDescription()) params.putUtfString(ParamsKey.DESCRIPTION, matchevent.getDescription());

        //   console.log("cmd" + Bd69SFSCmd.ADD_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_NEW_MATCH_EVENT, params);
    }

    sendRequestREMOVE_MATCH_EVENT(eventID: number, matchID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.EVENT_ID, eventID);
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_MATCH_EVENT, params);
    }
    sendRequestLEAGUE_REMOVE_MATCH_EVENT(eventID: number, matchID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.EVENT_ID, eventID);
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_MATCH_EVENT, params);
    }

    sendRequestUPDATE_MATCH_EVENT(matchEvent: MatchEvent) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.EVENT_ID, matchEvent.getEventID());
        params.putInt(ParamsKey.MATCH_ID, matchEvent.getMatchID());
        params.putInt(ParamsKey.LEAGUE_ID, matchEvent.getLeagueID());
        params.putUtfString(ParamsKey.NAME, matchEvent.getName());
        params.putInt(ParamsKey.TIME, matchEvent.getTime());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_MATCH_EVENT, params);
    }

    sendRequestLEAGUE_UPDATE_MATCH_EVENT(matchEvent: MatchEvent) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.EVENT_ID, matchEvent.getEventID());
        params.putInt(ParamsKey.MATCH_ID, matchEvent.getMatchID());
        params.putInt(ParamsKey.LEAGUE_ID, matchEvent.getLeagueID());
        params.putInt(ParamsKey.PLAYER_ID_1, matchEvent.getPlayerID1());
        params.putInt(ParamsKey.PLAYER_ID_2, matchEvent.getPlayerID2());
        params.putUtfString(ParamsKey.NAME, matchEvent.getName());
        params.putInt(ParamsKey.TIME, matchEvent.getTime());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_MATCH_EVENT, params);
    }

    sendRequestGetMatchInfo(matchID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_MATCH_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_MATCH_INFO, params);
    }

    sendRequestGetListMatchEvent(matchID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_MATCH_EVENT, params);
    }

    sendRequestLEAGUE_GET_LIST_MATCH_EVENT(matchID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_MATCH_EVENT, params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_MATCH_EVENT, params);
    }

    sendRequestGET_LIST_ROUND_OF_LEAGUE(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_ROUND_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_ROUND_OF_LEAGUE, params);
    }

    sendRequestADD_ROUND_INTO_LEAGUE(leagueID: number, rounds: Array<Rounds>) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (rounds.length == 1) {
            let item = new SFS2X.SFSObject();
            item.putInt(ParamsKey.LEAGUE_ID, rounds[0].getLeagueID());
            item.putUtfString(ParamsKey.NAME, rounds[0].getName());
            params.putSFSObject(ParamsKey.ITEM, item);
        } else {
            let newSFSArray = new SFS2X.SFSArray();
            for (let i = 0; i < rounds.length; i++) {
                newSFSArray.addSFSObject(rounds[i].toSFSObjectAdd());
            }
            params.putSFSArray(ParamsKey.ARRAY, newSFSArray);
        }
        //   console.log("cmd" + Bd69SFSCmd.ADD_ROUND_INTO_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_ROUND_INTO_LEAGUE, params);
    }

    sendRequestREMOVE_ROUND_FROM_LEAGUE(round: Rounds) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, round.getLeagueID());
        params.putInt(ParamsKey.ROUND_ID, round.getRoundiD());

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_ROUND_FROM_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_ROUND_FROM_LEAGUE, params);
    }

    sendRequestUPDATE_LEAGUE_ROUND(round: Rounds) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, round.getLeagueID());
        params.putInt(ParamsKey.ROUND_ID, round.getRoundiD());
        params.putUtfString(ParamsKey.NAME, round.getName());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_LEAGUE_ROUND, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_LEAGUE_ROUND, params);
    }

    sendRequestGET_ROUND_INFO(roundID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.ROUND_ID, roundID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_ROUND_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_ROUND_INFO, params);
    }

    sendRequestREMOVE_LEAGUE(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.STATE, LeagueState.DELETED);

        //   console.log("cmd" + Bd69SFSCmd.CHANGE_LEAGUE_STATE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.CHANGE_LEAGUE_STATE, params);
    }


    sendRequestAddGroupIntoLeague(leagueID: number, groupName: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.NAME, groupName);

        //   console.log("cmd" + Bd69SFSCmd.ADD_GROUP_INTO_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_GROUP_INTO_LEAGUE, params);
    }

    sendRequestRemoveGroupFromLeague(leagueID: number, groupID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.GROUP_ID, groupID);

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_GROUP_FROM_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_GROUP_FROM_LEAGUE, params);
    }

    sendRequestUPDATE_GROUP_IN_LEAGUE(group: Group) {

        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, group.getLeagueID());
        params.putInt(ParamsKey.GROUP_ID, group.getGroupID());
        params.putUtfString(ParamsKey.NAME, group.getName());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_GROUP_IN_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_GROUP_IN_LEAGUE, params);

    }

    sendRequestGET_GROUP_IN_LEAGUE_INFO(leagueID: number, groupID: number) {

        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.GROUP_ID, groupID);

        //   console.log("cmd" + Bd69SFSCmd.GET_GROUP_IN_LEAGUE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_GROUP_IN_LEAGUE_INFO, params);

    }

    sendRequestADD_NEW_REFEREE(referee: Referee) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.NAME, referee.getName());
        params.putUtfString(ParamsKey.PHONE, referee.getPhone());
        if (referee.getNumberLeague()) params.putInt(ParamsKey.NUMBER_LEAGUE, parseInt(referee.getNumberLeague() + ""));
        if (referee.getNumberMatch()) params.putInt(ParamsKey.NUMBER_MATCH, parseInt(referee.getNumberMatch() + ""));
        //   console.log("cmd" + Bd69SFSCmd.ADD_NEW_REFEREE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_NEW_REFEREE, params);
    }
    sendRequestUPDATE_REFEREE_INFO(referee: Referee) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, referee.getRefereeID());
        params.putUtfString(ParamsKey.NAME, referee.getName());
        params.putUtfString(ParamsKey.PHONE, referee.getPhone());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_REFEREE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_REFEREE_INFO, params);
    }
    sendRequestUPDATE_REFEREE_AVATAR(refereeID: number, avatar: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putUtfString(ParamsKey.AVATAR, avatar);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_REFEREE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_REFEREE_INFO, params);
    }
    sendRequestUPDATE_REFEREE_COVER(refereeID: number, cover: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putUtfString(ParamsKey.COVER, cover);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_REFEREE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_REFEREE_INFO, params);
    }
    sendRequestADD_REFEREE_INTO_LEAGUE(refereeID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.ADD_REFEREE_INTO_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.ADD_REFEREE_INTO_LEAGUE, params);
    }
    sendRequestREMOVE_REFEREE_FROM_LEAGUE(refereeID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.REMOVE_REFEREE_FROM_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.REMOVE_REFEREE_FROM_LEAGUE, params);
    }
    sendRequestGET_LIST_REFEREE_IN_LEAGUE(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_LIST_REFEREE_IN_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_LIST_REFEREE_IN_LEAGUE, params);
    }
    sendRequestSEARCH_REFEREE(searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);

        //   console.log("cmd" + Bd69SFSCmd.SEARCH_REFEREE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.SEARCH_REFEREE, params);
    }

    sendRequestUPDATE_CLUB_IN_LEAGUE_INFO(club: ClubInLeague) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, club.getLeagueID());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_CLUB_IN_LEAGUE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_CLUB_IN_LEAGUE_INFO, params);
    }

    sendRequestADD_CLUB_INTO_GROUP(clubID: number, leagueID: number, groupID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.GROUP_ID, groupID);

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_CLUB_IN_LEAGUE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_CLUB_IN_LEAGUE_INFO, params);
    }

    sendRequestUPDATE_DORNOR_INFO(dornor: Dornor) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornor.getDornorID());
        params.putInt(ParamsKey.NUMBER_LEAGUE, dornor.getNumberLeague());
        params.putUtfString(ParamsKey.NAME, dornor.getName());
        params.putUtfString(ParamsKey.WEBSITE, dornor.getWebsite());
        params.putUtfString(ParamsKey.YOUTUBE, dornor.getYoutube());
        params.putUtfString(ParamsKey.FACEBOOK, dornor.getFacebook());
        params.putUtfString(ParamsKey.DESCRIPTION, dornor.getDescription());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_DORNOR_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_DORNOR_INFO, params);
    }


    sendRequestUPDATE_DORNOR_LOGO(dornors : Dornor) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornors.getDornorID());
        params.putUtfString(ParamsKey.LOGO, dornors.getLogo());

        //   console.log("cmd" + Bd69SFSCmd.UPDATE_DORNOR_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.UPDATE_DORNOR_INFO, params);
    }

    sendRequestGetTopGoalInLeague(leagueID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (page) params.putInt(ParamsKey.PAGE, page);

        //   console.log("cmd" + Bd69SFSCmd.GET_TOP_GOAL_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_TOP_GOAL_OF_LEAGUE, params);
    }

    sendRequestGetTopCardInLeague(leagueID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (page) params.putInt(ParamsKey.PAGE, page);

        //   console.log("cmd" + Bd69SFSCmd.GET_TOP_CARD_OF_LEAGUE, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_TOP_CARD_OF_LEAGUE, params);
    }

    sendRequestGET_PLAYER_IN_LEAGUE_INFO(playerID: number, clubID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //   console.log("cmd" + Bd69SFSCmd.GET_PLAYER_IN_LEAGUE_INFO, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_PLAYER_IN_LEAGUE_INFO, params);
    }

    sendRequestGET_USER_STATISTIC(userID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);

        //   console.log("cmd" + Bd69SFSCmd.GET_USER_STATISTIC, params.getDump());
        this.send("bd69." + Bd69SFSCmd.GET_USER_STATISTIC, params);
    }

    sendRequestAPP_GET_LIST_LEAGUE(searchQuery?: string, page?: number, state?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STATE, state);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);

        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_LEAGUE, params);
    }

    sendRequestAPP_REMOVE_CLUB_MANAGER(managerID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MANAGER_ID, managerID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        this.send("bd69." + Bd69SFSCmd.APP_REMOVE_CLUB_MANAGER, params);
    }

    sendRequestAPP_DELETE_DORNOR(dornorID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        this.send("bd69." + Bd69SFSCmd.APP_DELETE_DORNOR, params);
    }

    sendRequestAPP_ADD_NEW_LEAGUE(newLeague: Leagues) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.NAME, newLeague.getName());
        params.putInt(ParamsKey.TYPE, parseInt(newLeague.getType() + ""));
        if (newLeague.getNumberClub() > -1) params.putInt(ParamsKey.NUMBER_CLUB, newLeague.getNumberClub());
        if (newLeague.getTimeStart()) params.putLong(ParamsKey.TIME_START, newLeague.getTimeStart());
        if (newLeague.getTimeEnd()) params.putLong(ParamsKey.TIME_END, newLeague.getTimeEnd());

        this.send("bd69." + Bd69SFSCmd.APP_ADD_NEW_LEAGUE, params);
    }

    sendRequestAPP_DELETE_LEAGUE(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.APP_DELETE_LEAGUE, params);
    }

    sendRequestAPP_GET_LEAGUE_INFO(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.APP_GET_LEAGUE_INFO, params);
    }

    sendRequestAPP_UPDATE_LEAGUE_INFO(leagueID: number, info: Leagues) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.NAME, info.getName());
        params.putInt(ParamsKey.TYPE, info.getType());
        params.putInt(ParamsKey.NUMBER_CLUB, info.getNumberClub());
        params.putLong(ParamsKey.TIME_START, info.getTimeStart());
        params.putLong(ParamsKey.TIME_END, info.getTimeEnd());
        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_LEAGUE_INFO, params);
    }
    sendRequestAPP_UPDATE_LEAGUE_LOGO(leagueID: number, logo: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.LOGO, logo);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_LEAGUE_INFO, params);
    }
    sendRequestAPP_UPDATE_LEAGUE_COVER(leagueID: number, cover: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.COVER, cover);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_LEAGUE_INFO, params);
    }

    sendRequestGET_LIST_LEAGUE_ADMIN(searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);


        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_LEAGUE_ADMIN, params);
    }
    sendRequestAPP_ADD_LEAGUE_ADMIN(userID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);

        this.send("bd69." + Bd69SFSCmd.APP_ADD_LEAGUE_ADMIN, params);
    }
    sendRequestAPP_REMOVE_LEAGUE_ADMIN(userID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);

        this.send("bd69." + Bd69SFSCmd.APP_REMOVE_LEAGUE_ADMIN, params);
    }

    sendRequestAPP_UPDATE_LEAGUE_ADMIN(leagueID: number, userID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MANAGER_ID, userID);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_LEAGUE_ADMIN, params);
    }

    sendRequestAPP_GET_LIST_CLUB(searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);

        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_CLUB, params);
    }

    sendRequestAPP_ADD_NEW_CLUB(club: Clubs) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.NAME, club.getName());
        if (club.getSlogan()) params.putUtfString(ParamsKey.SLOGAN, club.getSlogan());
        if (club.getDescription()) params.putUtfString(ParamsKey.DESCRIPTION, club.getDescription());

        this.send("bd69." + Bd69SFSCmd.APP_ADD_NEW_CLUB, params);
    }

    sendRequestAPP_DELETE_CLUB(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.APP_DELETE_CLUB, params);
    }

    sendRequestAPP_GET_CLUB_INFO(clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.APP_GET_CLUB_INFO, params);
    }

    sendRequestAPP_UPDATE_NAME_CLUB(clubID: number, name: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putUtfString(ParamsKey.NAME, name)

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_CLUB_INFO, params);
    }

    sendRequestAPP_UPDATE_NAME_DORNOR(dornorID: number, name: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putUtfString(ParamsKey.NAME, name);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_DORNOR_INFO, params);
    }

    sendRequestAPP_UPDATE_LOGO_DORNOR(dornorID: number, logo: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putUtfString(ParamsKey.LOGO, logo);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_DORNOR_INFO, params);
    }

    sendRequestAPP_UPDATE_DESCRIPTION_DORNOR(dornorID: number, description: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putUtfString(ParamsKey.DESCRIPTION, description);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_DORNOR_INFO, params);
    }

    sendRequestAPP_UPDATE_WEBSITE_DORNOR(dornorID: number, website: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putUtfString(ParamsKey.WEBSITE, website);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_DORNOR_INFO, params);
    }

    sendRequestAPP_UPDATE_FACEBOOK_DORNOR(dornorID: number, facebook: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putUtfString(ParamsKey.FACEBOOK, facebook);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_DORNOR_INFO, params);
    }

    sendRequestAPP_UPDATE_YOUTUBE_DORNOR(dornorID: number, youtube: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putUtfString(ParamsKey.YOUTUBE, youtube);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_DORNOR_INFO, params);
    }

    sendRequestAPP_GET_LIST_DORNOR(page?: number) {
        let params = new SFS2X.SFSObject();

        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_DORNOR, params);
    }

    sendRequestAPP_ADD_NEW_DORNOR(dornor: Dornor) {
        let params = new SFS2X.SFSObject();

        params.putUtfString(ParamsKey.NAME, dornor.getName());
        if (dornor.getDescription()) params.putUtfString(ParamsKey.DESCRIPTION, dornor.getDescription());
        if (dornor.getFacebook()) params.putUtfString(ParamsKey.FACEBOOK, dornor.getFacebook());
        if (dornor.getWebsite()) params.putUtfString(ParamsKey.WEBSITE, dornor.getWebsite());
        if (dornor.getYoutube()) params.putUtfString(ParamsKey.YOUTUBE, dornor.getYoutube());
        this.send("bd69." + Bd69SFSCmd.APP_ADD_NEW_DORNOR, params);
    }

    sendRequestAPP_GET_LIST_REFEREE(searchQuery?: string, page?: number, state?: number) {
        let params = new SFS2X.SFSObject();
        if (state) params.putInt(ParamsKey.STATE, state);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_REFEREE, params);
    }

    sendRequestAPP_GET_LIST_CLUB_MANAGER(searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_CLUB_MANAGER, params);
    }

    sendRequestAPP_GET_LIST_CLUB_OF_CLUB_MANAGER(userID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        if (userID) params.putInt(ParamsKey.USER_ID, userID);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_CLUB_USER_MANAGE, params);
    }

    sendRequestAPP_ADD_NEW_REFEREE(userID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);
        this.send("bd69." + Bd69SFSCmd.APP_ADD_NEW_REFEREE, params);
    }

    sendRequestAPP_DELETE_REFEREE(userID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, userID);
        this.send("bd69." + Bd69SFSCmd.APP_DELETE_REFEREE, params);
    }

    sendRequestAPP_GET_REFEREE_INFO(userID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, userID);
        this.send("bd69." + Bd69SFSCmd.APP_GET_REFEREE_INFO, params);
    }

    sendRequestAPP_UPDATE_REFEREE_INFO(userID: number, info: User) {
        let params = new SFS2X.SFSObject();
        // params.S(ParamsKey.NAME,info.getName());
        // params.putUtfString(ParamsKey.EMAIL,info.getPhone());
        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_REFEREE_INFO, params);
    }



    sendRequestAPP_UPDATE_LOGO_CLUB(clubID: number, logo: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putUtfString(ParamsKey.LOGO, logo)

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_CLUB_INFO, params);
    }

    sendRequestAPP_UPDATE_COVER_CLUB(clubID: number, cover: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putUtfString(ParamsKey.COVER, cover)

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_CLUB_INFO, params);
    }

    sendRequestAPP_UPDATE_CLUB_MANAGER(userID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MANAGER_ID, userID);
        params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_CLUB_MANAGER, params);
    }

    sendRequestLEAGUE_GET_LEAGUE_INFO(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LEAGUE_INFO, params);
    }

    sendRequestLEAGUE_GET_TABLE(leagueID: number, groupID?:number){
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if(groupID)params.putInt(ParamsKey.GROUP_ID,groupID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_TABLE, params);
    }

    sendRequestLEAGUE_UPDATE_LEAGUE_INFO(leagueID: number, info: Leagues) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.NUMBER_CLUB, parseInt(info.getNumberClub() + ""));
        params.putLong(ParamsKey.TIME_START, info.getTimeStart());
        params.putLong(ParamsKey.TIME_END, info.getTimeEnd());
        params.putInt(ParamsKey.TYPE, parseInt(info.getType() + ""));
        params.putUtfString(ParamsKey.DESCRIPTION,info.getDescription());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_LEAGUE_INFO, params);
    }

    sendRequestLEAGUE_UPDATE_CLUB_INFO(clubinleague: ClubInLeague) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, clubinleague.getLeagueID());
        params.putInt(ParamsKey.CLUB_ID, clubinleague.getClubID());
        params.putInt(ParamsKey.WON, clubinleague.getWon());
        params.putInt(ParamsKey.DRAWN, clubinleague.getDrawn());
        params.putInt(ParamsKey.LOST, clubinleague.getLost());
        params.putInt(ParamsKey.GOALS_FOR, clubinleague.getGoalsFor());
        params.putInt(ParamsKey.GOALS_AGAINST, clubinleague.getGoalsAgainst());
        params.putInt(ParamsKey.YELLOW_CARD_NUMBER, clubinleague.getYellowCardNumber());
        params.putInt(ParamsKey.RED_CARD_NUMBER, clubinleague.getRedCardNumber());
        params.putInt(ParamsKey.PLAYED, clubinleague.getPlayed());
        params.putInt(ParamsKey.POINTS, clubinleague.getPoints());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_CLUB_INFO, params);
    }

    sendRequestLEAGUE_UPDATE_LEAGUE_LOGO(leagueID: number, logo: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.LOGO, logo);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_LEAGUE_INFO, params);
    }

    sendRequestLEAGUE_UPDATE_LEAGUE_COVER(leagueID: number, cover: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.COVER, cover);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_LEAGUE_INFO, params);
    }

    sendRequestLEAGUE_GET_LEAGUE_RULE(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        //  console.log("params get league rule", params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LEAGUE_RULE, params);
    }

    sendRequestLEAGUE_UPDATE_LEAGUE_RULE(leagueID: number, rule: Rule) {
        let obj = new SFS2X.SFSObject();
        obj.putInt(ParamsKey.LEAGUE_ID, parseInt(rule.getLeagueID() + ""));
        obj.putInt(ParamsKey.WON_POINT, parseInt(rule.getWonPoint() + ""));
        obj.putInt(ParamsKey.DRAWN_POINT, parseInt(rule.getDrawnPoint() + ""));
        obj.putInt(ParamsKey.LOST_POINT, parseInt(rule.getLostPoint() + ""));
        obj.putInt(ParamsKey.POINT_PRIORITY, parseInt(rule.getPointPriority() + ""));
        obj.putInt(ParamsKey.GD_PRIORITY, parseInt(rule.getGdPriority() + ""));
        obj.putInt(ParamsKey.NAME_PRIORITY, parseInt(rule.getNamePriority() + ""));
        obj.putInt(ParamsKey.AGAINST_PRIORITY, parseInt(rule.getAgainstPriority() + ""));
        obj.putInt(ParamsKey.FAIRPLAY_PRIORITY, parseInt(rule.getFairplayPriority() + ""));
        obj.putInt(ParamsKey.DURATION, parseInt(rule.getDuration() + ""));
        obj.putInt(ParamsKey.MAX_PLAYER_PER_CLUB, parseInt(rule.getMaxPlayerPerClub() + ""));
        obj.putInt(ParamsKey.NUMBER_PLAY_PLAYER, parseInt(rule.getNumberPlayPlayer() + ""));
        obj.putInt(ParamsKey.BREAK_TIME, parseInt(rule.getBreakTime() + ""));
        obj.putInt(ParamsKey.SUBSTITUTE, parseInt(rule.getSubstitue() + ""));
        obj.putInt(ParamsKey.REFEREE_IN_MATCH, parseInt(rule.getRefereeInMatch() + ""));
        obj.putInt(ParamsKey.RECORD_ENABLE, parseInt(rule.getRecordEnable() + ""));
        obj.putLong(ParamsKey.RECORD_START, parseInt(rule.getRecordStart() + ""));
        obj.putLong(ParamsKey.RECORD_END, parseInt(rule.getRecordEnd() + ""));
        //  console.log("params get league rule", params.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_LEAGUE_RULE, obj);
    }

    senRequestLEAGUE_CLUB_UPDATE_PLAYER_ROLE(leagueID: number, clubID: number, playerID: number, roleInClubInLeague){
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        params.putInt(ParamsKey.ROLE_IN_CLUB, roleInClubInLeague);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_UPDATE_PLAYER_ROLE, params);
    }

    sendRequestLEAGUE_GET_PLAYER_FORM(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_PLAYER_FORM, params);
    }

    sendRequestLEAGUE_UPDATE_PLAYER_FORM(leagueID: number, arrayString: string) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.ITEM, arrayString);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_PLAYER_FORM, params);
    }



    sendRequestLEAGUE_GET_LIST_PLAYER_FORM(leagueID: number, clubId: number, page ?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubId);
        if(page) params.putInt(ParamsKey.PAGE, page)

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER_FORM, params);
    }

    sendRequestLEAGUE_CLUB_SUBMIT_MATCH_RECORD(clubID: number, matchID: number, leagueID: number, state: number){
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MATCH_ID,matchID);
        params.putInt(ParamsKey.LEAGUE_ID,leagueID);
        params.putInt(ParamsKey.CLUB_ID,clubID);
        params.putInt(ParamsKey.STATE,state);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_SUBMIT_MATCH_RECORD, params);

    }

    sendRequestLEAGUE_CLUB_GET_LIST_PLAYER_FORM(leagueID: number, clubId: number, page ?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubId);
        if(page) params.putInt(ParamsKey.PAGE, page)

        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_GET_LIST_PLAYER_FORM, params);
    }

    sendRequestLEAGUE_ADD_CLUB(clubId: number, leagueID: number, managerID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubId);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MANAGER_ID, managerID)
        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_CLUB, params);
    }

    sendRequestLEAGUE_GET_LIST_CLUB(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_CLUB, params);
    }

    sendRequestLEAGUE_GET_CLUB_INFO(leagueID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_CLUB_INFO, params);
    }

    sendRequestLEAGUE_GET_PLAYER_FORM_DATA(leagueID: number, playerID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_PLAYER_FORM_DATA, params);
    }

    sendRequestLEAGUE_CLUB_GET_PLAYER_FORM_DATA(clubID: number ,leagueID: number, playerID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID,clubID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_GET_PLAYER_FORM_DATA, params);
    }

    // sendRequestLEAGUE_GET_LIST_PLAYER_FORM(leagueID: number, clubID: number) {
    //     let params = new SFS2X.SFSObject();
    //     params.putInt(ParamsKey.LEAGUE_ID, leagueID);
    //     params.putInt(ParamsKey.CLUB_ID, clubID);
    //     this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER_FORM, params);
    // }


    sendRequestLEAGUE_REMOVE_CLUB(clubId: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubId);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_CLUB, params);
    }

    sendRequestLEAGUE_UPDATE_CLUB_MANAGER(userID: number, clubId: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.MANAGER_ID, userID);
        params.putInt(ParamsKey.CLUB_ID, clubId);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_CLUB_MANAGER, params);
    }

    sendRequestLEAGUE_GET_LIST_PLAYER(leagueID: number, clubId?: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        if (clubId) params.putInt(ParamsKey.CLUB_ID, clubId);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_PLAYER, params);
    }

    sendRequestLEAGUE_CLUB_GET_LIST_PLAYER(leagueID: number, clubId: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        params.putInt(ParamsKey.CLUB_ID, clubId);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_GET_LIST_PLAYER, params);
    }

    sendRequestLEAGUE_SEARCH_PLAYER(leagueID: number, searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_SEARCH_PLAYER, params);
    }

    sendRequestLEAGUE_SEARCH_USER(leagueID: number, searchQuery: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putUtfString(ParamsKey.QUERY, searchQuery);
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_SEARCH_USER, params);
    }
    //App Stadium
    sendRequestAPP_GET_LIST_STADIUM(page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PAGE, page);

        this.send("bd69." + Bd69SFSCmd.APP_GET_LIST_STADIUM, params);
    }

    sendRequestAPP_ADD_NEW_STADIUM(stadium: Stadium) {
        let params = new SFS2X.SFSObject();
        params.putUtfString("name", stadium.getName());
        params.putUtfString("address", stadium.getAddress());
        params.putInt("type", stadium.getType());
        params.putInt("state", stadium.getState());
        params.putUtfString("logo", stadium.getLogo());
        params.putUtfString("cover", stadium.getCover());
        params.putUtfString("hotlines", stadium.getHotlines());
        params.putInt("district_id", stadium.getDistrictID());
        params.putDouble("lat", stadium.getLat());
        params.putDouble("lng", stadium.getLng());
        params.putInt("open_time", stadium.getOpenTime());
        params.putInt("close_time", stadium.getCloseTime());
        params.putLong("time_created", stadium.getTimeCreated());

        this.send("bd69." + Bd69SFSCmd.APP_ADD_NEW_STADIUM, params);
    }

    sendRequestAPP_DELETE_STADIUM(stadiumID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);

        this.send("bd69." + Bd69SFSCmd.APP_DELETE_STADIUM, params);
    }

    sendRequestAPP_GET_STADIUM_INFO(stadiumID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);

        this.send("bd69." + Bd69SFSCmd.APP_GET_STADIUM_INFO, params);
    }

    sendRequestAPP_UPDATE_STADIUM_INFO_NAME(stadiumID: number, stadium: Stadium) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);
        if (stadium.getName()) params.putUtfString(ParamsKey.NAME, stadium.getName());


        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_STADIUM_INFO, params);
    }

    sendRequestAPP_UPDATE_STADIUM_INFO_ADDRESS(stadiumID: number, stadium: Stadium) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);
        if (stadium.getAddress()) params.putUtfString(ParamsKey.ADDRESS, stadium.getAddress());

        this.send("bd69." + Bd69SFSCmd.APP_UPDATE_STADIUM_INFO, params);
    }
    //


    // App Club

    sendRequestCLUB_ADD_PLAYER_INTO_CLUB(playerID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, playerID);
        params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.CLUB_ADD_PLAYER_INTO_CLUB, params);
    }

    sendRequestCLUB_REMOVE_PLAYER_FROM_CLUB(playerID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PLAYER_ID, playerID);
        params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.CLUB_REMOVE_PLAYER_FROM_CLUB, params);
    }

    sendRequestCLUB_GET_LIST_PLAYER(clubID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PAGE,page ? page : 0);
        
        this.send("bd69." + Bd69SFSCmd.CLUB_GET_LIST_PLAYER, params);
    }

    sendRequestCLUB_SEARCH_PLAYER(searchQuery: string, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.QUERY, searchQuery);
        params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.CLUB_SEARCH_PLAYER, params);
    }

    sendRequestCLUB_UPDATE_PLAYER_INFO(player: Player, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.CLUB_ID, clubID);
        if (player.getName()) params.putInt(ParamsKey.NAME, player.getName());

        this.send("bd69." + Bd69SFSCmd.CLUB_UPDATE_PLAYER_INFO, params);
    }
    //


    sendRequestLEAGUE_REMOVE_PLAYER_FROM_LEAGUE(playerID: number, leagueID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_PLAYER_FROM_LEAGUE, params);
    }

    sendRequestLEAGUE_CLUB_REMOVE_PLAYER_FROM_LEAGUE(playerID: number, leagueID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_REMOVE_PLAYER_FROM_LEAGUE, params);
    }

    sendRequestLEAGUE_ADD_PLAYER_INTO_LEAGUE(playerID: number, leagueID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_PLAYER_INTO_LEAGUE, params);
    }

    sendRequestLEAGUE_CLUB_ADD_PLAYER_INTO_LEAGUE(playerID: number, leagueID: number, clubID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.CLUB_ID, clubID);
        params.putInt(ParamsKey.PLAYER_ID, playerID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_CLUB_ADD_PLAYER_INTO_LEAGUE, params);
    }

    sendRequestLEAGUE_GET_LIST_REFEREE(leagueID: number, searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_REFEREE, params);
    }

    sendRequestLEAGUE_ADD_REFEREE(refereeID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_REFEREE, params);
    }

    sendRequestLEAGUE_SEARCH_REFEREE(leagueID: number, searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_SEARCH_REFEREE, params);
    }

    sendRequestLEAGUE_REMOVE_REFEREE(refereeID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_REFEREE, params);
    }


    sendRequestLEAGUE_GET_LIST_DORNOR(leagueID: number, searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_DORNOR, params);
    }

    sendRequestLEAGUE_ADD_DORNOR(dornorID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_DORNOR, params);
    }

    sendRequestLEAGUE_SEARCH_DORNOR(leagueID: number, searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_SEARCH_DORNOR, params);
    }

    sendRequestLEAGUE_REMOVE_DORNOR(dornorID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_DORNOR, params);
    }

    sendRequestLEAGUE_UPDATE_DORNOR_INFO(dornorID: number, leagueID: number, priority: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PRIORITY, priority);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_DORNOR_INFO, params);
    }

    sendRequestLEAGUE_GET_LIST_EDITOR(leagueID: number, searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_EDITOR, params);
    }

    sendRequestLEAGUE_ADD_EDITOR(userID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_EDITOR, params);
    }

    sendRequestLEAGUE_REMOVE_EDITOR(userID: number, leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_EDITOR, params);
    }

    sendRequestLEAGUE_SEARCH_EDITOR(leagueID: number, searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_SEARCH_EDITOR, params);
    }

    sendRequestLEAGUE_UPDATE_EDITOR_INFO(leagueID: number, userID: number, state: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.USER_ID, userID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.STATE, state);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_EDITOR_INFO, params);
    }

    sendRequestLEAGUE_GET_LIST_MATCH(leagueID: number, clubID?: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        if (clubID) params.putInt(ParamsKey.CLUB_ID, clubID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_MATCH, params);
    }

    sendRequestLEAGUE_REMOVE_MATCH(leagueID: number, matchID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MATCH_ID, matchID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_MATCH, params);
    }

    //League stadium
    sendRequestLEAGUE_GET_LIST_STATIDUM(leagueID: number, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if(page) params.putInt(ParamsKey.PAGE, page);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_STATIDUM, params);
    }

    sendRequestLEAGUE_ADD_STADIUM(leagueID: number, stadiumID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_STADIUM, params);
    }

    sendRequestLEAGUE_REMOVE_STADIUM(leagueID: number, stadiumID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.STADIUM_ID, stadiumID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_STADIUM, params);
    }

    sendRequestLEAGUE_SEARCH_STADIUM(leagueID: number, searchQuery?: string, page?: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        if (searchQuery) params.putUtfString(ParamsKey.QUERY, searchQuery);
        if (page) params.putInt(ParamsKey.PAGE, page);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_SEARCH_STADIUM, params);
    }

    //

    sendRequestLEAGUE_GET_LIST_ROUND(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_ROUND, params);

    }
    sendRequestLEAGUE_GET_LIST_GROUP(leagueID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_GROUP, params);

    }
    sendRequestLEAGUE_GET_LIST_MATCH_REFEREE(leagueID: number, matchID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MATCH_ID, matchID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_LIST_MATCH_REFEREE, params);

    }

    sendRequestLEAGUE_UPDATE_MATCH_INFO(leagueID: number, info: Match) {
        let obj = new SFS2X.SFSObject();

        obj.putInt(ParamsKey.LEAGUE_ID, leagueID);
        obj.putInt(ParamsKey.MATCH_ID, info.getMatchID());
        obj.putInt(ParamsKey.DURATION, parseInt(info.getDuration() + ""));
        obj.putLong(ParamsKey.TIME_START, info.getTimeStart());
        obj.putInt(ParamsKey.STADIUM_ID, info.getStadiumID());
        obj.putInt(ParamsKey.ROUND_ID, info.getRoundID());
        //   console.log("cmd" + Bd69SFSCmd.UPDATE_MATCH_INFO, obj.getDump());
        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_MATCH_INFO, obj);
    }

    sendRequestLEAGUE_ADD_NEW_MATCH(match: Match) {
        let params = new SFS2X.SFSObject();

        params.putInt(ParamsKey.HOME_ID, match.getHomeID());
        params.putInt(ParamsKey.AWAY_ID, match.getAwayID());
        params.putInt(ParamsKey.LEAGUE_ID, match.getLeagueID());
        params.putInt(ParamsKey.STADIUM_ID, match.getStadiumID());
        params.putLong(ParamsKey.TIME_START, match.getTimeStart());

        if (match.getRoundID() > -1) params.putInt(ParamsKey.ROUND_ID, match.getRoundID());
        if (match.getGroupID() > -1) params.putInt(ParamsKey.GROUP_ID, match.getGroupID());
        if (match.getDuration() > 0) params.putInt(ParamsKey.DURATION, parseInt(match.getDuration() + ""));

        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_NEW_MATCH, params);
    }

    sendRequestLEAGUE_ADD_REFEREE_INTO_MATCH(refereeID: number, leagueID: number, matchID: number, role: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.ROLE, role);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_ADD_REFEREE_INTO_MATCH, params);
    }

    sendRequestLEAGUE_REMOVE_REFEREE_FROM_MATCH(refereeID: number, leagueID: number, matchID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MATCH_ID, matchID);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_REMOVE_REFEREE_FROM_MATCH, params);
    }

    sendRequestAPP_GET_DORNOR_INFO(dornorID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DORNOR_ID, dornorID);

        this.send("bd69." + Bd69SFSCmd.APP_GET_DORNOR_INFO, params);
    }

    sendRequestLEAGUE_UPDATE_REFEREE_IN_MATCH(refereeID: number, leagueID: number, matchID: number, role: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.REFEREE_ID, refereeID);
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MATCH_ID, matchID);
        params.putInt(ParamsKey.ROLE, role);

        this.send("bd69." + Bd69SFSCmd.LEAGUE_UPDATE_REFEREE_IN_MATCH, params);
    }
    sendRequestLEAGUE_GET_MATCH_INFO(leagueID: number, matchID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID, leagueID);
        params.putInt(ParamsKey.MATCH_ID, matchID);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_GET_MATCH_INFO, params);
    }

    sendRequestGET_LIST_MATCH_FEED(page?:number){
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PAGE, page ? page : 0);
        this.send("bd69." + Bd69SFSCmd.GET_LIST_MATCH_FEED, params);
    }

    sendRequestLEAGUE_PUSH_NOTIFICATION(leagueID: number, message: string, arrayIDs: Array<number>){
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.LEAGUE_ID,leagueID);
        params.putUtfString(ParamsKey.MESSAGE,message);
        params.putIntArray(ParamsKey.ARRAY,arrayIDs);
        this.send("bd69." + Bd69SFSCmd.LEAGUE_PUSH_NOTIFICATION, params);
    }
}