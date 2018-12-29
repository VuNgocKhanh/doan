import { Clubs } from "../classes/clubs";
import { Bd69SFSConnector } from "../smartfox/bd69-sfs-connector";
import { Player } from "../classes/player";
import { RoleInClub, RequestState } from "./constant-manager";
import { ClubInLeague } from "../classes/clubinleague";

export class ClubManager {

    public mClubsInLeague: Array<ClubInLeague> = [];

    public mClubs: Array<Clubs> = [];

    public mMapClubs: Map<number, Clubs> = new Map<number, Clubs>();

    public mMapClubsInLeague: Map<number, ClubInLeague> = new Map<number, ClubInLeague>();

    constructor() {
        this.mClubs = [];
    }

    onGetClubManager() {
        return this.mClubs.filter(club => {
            return club.getRoleOfUser() >= RoleInClub.CAPTAIN;
        })
    }

    addClub(club: Clubs) {
        this.mClubs.push(club);
        this.mMapClubs.set(club.getClubID(), club);
    }

    addClubInLeague(club: ClubInLeague) {
        this.mClubsInLeague.push(club);
        this.mMapClubsInLeague.set(club.getClubID(), club);
    }

    removeClub(clubID) {

        for (let i = 0; i < this.mClubs.length; i++) {
            if (this.mClubs[i] && this.mClubs[i].getClubID() == clubID) {
                this.mClubs.splice(i, 1);
                this.mMapClubs.delete(clubID);

                return;
            }
        }
    }

    checkClubUserTakePartIn(clubID: number): number {
        let check = RoleInClub.GUEST;
        if (this.mMapClubs.size == 0) return RoleInClub.GUEST;
        let club = this.getClubByID(clubID);
        if (club != null) {
            check = club.getRoleOfUser();
        }
        return check;
    }

    onResponeSFSArray(sfsArray) {
        this.mClubs = [];
        this.mMapClubs.clear();
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new Clubs();
            newClub.fromSFSobject(sfsdata);
            this.addClub(newClub);
        }
    }


    onResponeClubInLeagueSFSArray(sfsArray) {
        this.mClubsInLeague = [];
        this.mMapClubsInLeague.clear();
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new ClubInLeague();
            this.addClubInLeague(newClub);
        }
    }

    onParseSFSArray(sfsArray) : Array<Clubs> {
        let res = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newClub = new Clubs();
            newClub.fromSFSobject(sfsdata);
            res.push(newClub);
        }
        return res;
    }


    getClubByID(clubID: number): Clubs {
        if (this.mMapClubs.has(clubID)) {
            return this.mMapClubs.get(clubID);
        } else {
            return null;
        }
    }

    getClubs(): Array<Clubs> {
        return this.mClubs;
    }

    getClubsInLeague(): Array<ClubInLeague> {
        return this.mClubsInLeague;
    }


    getRecentClubs() {
        let res = [];
        for (let i = 0; i < this.mClubs.length; i++) {
            if (i < 2) {
                res.push(this.mClubs[i]);
            } else {
                break;
            }
        }
        return res;
    }


    private mClub = new Clubs();

    getClub(): Clubs {
        return this.mClub;
    }

    onFakeClubData() {
        this.mClub.setName("Arsenal");
        this.mClub.setLogo("https://i1.wp.com/dlscenter.com/wp-content/uploads/2017/06/Arsenal-Logo.png?resize=256%2C256");
        this.mClub.setNumberPlayer(10);
    }

    onDeclineRequest(userID: number, clubID: number) {
        Bd69SFSConnector.getInstance().processRequestJoinClub(clubID, userID, RequestState.DELINE);
    }
    onAcceptRequest(userID: number, clubID: number) {
        Bd69SFSConnector.getInstance().processRequestJoinClub(clubID, userID, RequestState.ACCEPT);
    }
    onSetManager(playerId: string) {

    }
    onCancelManager(playerId: string) {
    }
    onSetCaptain(playerId: string) {
    }
    onCancelCaptain(playerId: string) {
    }
    onKickMember(playerId: string) {
    }

    playerAvailable: Array<Player> = [];
    onFakePlayer() {
        for (let i = 0; i < 10; i++) {
            let mPlayer = new Player();
            mPlayer.setNickName("Fi Văn Fa" + i);
            mPlayer.setShirtNumber(10);
            this.playerAvailable.push(mPlayer);
        }
    }
    getPlayerAvaiable(): Array<Player> {
        return this.playerAvailable;
    }

    sendRequestSearchClub(searchQuery: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestSearchClub(searchQuery, page ? page : null);
    }

    sendRequestGetClubOfUser() {
        Bd69SFSConnector.getInstance().sendRequestGetClubOfUser();
    }

    sendRequestGetPlayerInClub(clubID: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGetUserInClub(clubID, page ? page : 0);
    }

    sendRequestGetUserRequestInClub(clubID: number) {
        Bd69SFSConnector.getInstance().getRequestJoinClub(clubID);
    }

    sendRequestAddUserIntoClub(userID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestAddUserIntoClub(userID, clubID);
    }

    sendRequestLeaveClub(clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestLeaveClub(clubID);
    }

    sendRequestKickPlayer(clubID: number, playerID: number) {
        Bd69SFSConnector.getInstance().sendRequestKickPlayer(clubID, playerID);
    }

    sendRequestChangeRole(clubID: number, playerID: number, role: number) {
        Bd69SFSConnector.getInstance().sendRequestChangeRole(clubID, playerID, role);
    }

    sendRequestUpdateClubInfo(clubID: number, name?: string, description?: string, slogan?: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateClubInfo(clubID, name ? name : null, description ? description : null, slogan ? slogan : null)
    }

    sendRequestUpdateClubCover(clubID: number, cover: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateClubCover(clubID, cover);
    }

    sendRequestUpdateClubLogo(clubID: number, logo: string) {
        Bd69SFSConnector.getInstance().sendRequestUpdateClubLogo(clubID, logo);
    }

    sendRequestGetListMatchOfClub(clubID: number){
        Bd69SFSConnector.getInstance().sendRequestGetListMatchOfClub(clubID);
    }

    sendRequestGetListClubOfManager(){
        Bd69SFSConnector.getInstance().sendRequestGetListClubOfManager();
    }
}