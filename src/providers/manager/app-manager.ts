import { Leagues } from "../classes/league";
import { Bd69SFSConnector } from "../smartfox/bd69-sfs-connector";
import { User } from "../classes/user";
import { Clubs } from "../classes/clubs";
import { Stadium } from "../classes/stadium";
import { Player } from "../classes/player";
import { Dornor } from "../classes/donnor";

export class AppManager {
    public static _instance: AppManager = null;

    constructor() {

    }

    public static getInstance(): AppManager {
        if (this._instance == null) {
            this._instance = new AppManager();
        }
        return this._instance;
    }

    public sendRequestGET_LIST_LEAGUE_ADMIN(searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGET_LIST_LEAGUE_ADMIN(searchQuery ? searchQuery : null, page ? page : 0);
    }
    public sendRequestAPP_ADD_LEAGUE_ADMIN(userID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_ADD_LEAGUE_ADMIN(userID);
    }
    public sendRequestAPP_REMOVE_LEAGUE_ADMIN(userID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_REMOVE_LEAGUE_ADMIN(userID);
    }

    public sendRequestAPP_GET_LIST_LEAGUE(searchQuery?: string, page?: number, state?: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_LEAGUE(searchQuery ? searchQuery : null, page ? page : 0, (state || state == 0) ? state : -1);
    }

    public sendRequestAPP_ADD_NEW_LEAGUE(newLeague: Leagues) {
        Bd69SFSConnector.getInstance().sendRequestAPP_ADD_NEW_LEAGUE(newLeague);
    }

    public sendRequestAPP_DELETE_LEAGUE(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_DELETE_LEAGUE(leagueID);
    }

    public sendRequestAPP_GET_LEAGUE_INFO(leagueID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LEAGUE_INFO(leagueID);
    }

    public sendRequestAPP_UPDATE_LEAGUE_INFO(leagueID: number, info: Leagues) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_LEAGUE_INFO(leagueID, info);
    }
    public sendRequestAPP_UPDATE_LEAGUE_LOGO(leagueID: number, logo: string) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_LEAGUE_LOGO(leagueID, logo);
    }

    public sendRequestAPP_UPDATE_LEAGUE_COVER(leagueID: number, cover: string) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_LEAGUE_COVER(leagueID, cover);
    }

    public sendRequestAPP_GET_LIST_REFEREE(searchQuery?: string, page?: number, state?: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_REFEREE(searchQuery ? searchQuery : null, page ? page : 0, state ? state : null);
    }

    public sendRequestAPP_GET_LIST_CLUB_MANAGER(searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_CLUB_MANAGER(searchQuery ? searchQuery : null, page ? page : 0);
    }

    public sendRequestAPP_GET_LIST_CLUB_OF_CLUB_MANAGER(userID: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_CLUB_OF_CLUB_MANAGER(userID, page ? page : 0);
    }

    public sendRequestAPP_ADD_NEW_REFEREE(userID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_ADD_NEW_REFEREE(userID);
    }

    public sendRequestAPP_DELETE_REFEREE(userID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_DELETE_REFEREE(userID);
    }
    public sendRequestAPP_GET_REFEREE_INFO(userID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_REFEREE_INFO(userID);
    }

    public sendRequestAPP_UPDATE_REFEREE_INFO(userID: number, info: User) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_REFEREE_INFO(userID, info);
    }

    public sendRequestAPP_GET_LIST_CLUB(searchQuery?: string, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_CLUB(searchQuery, page);
    }

    public sendRequestAPP_ADD_NEW_CLUB(club: Clubs) {
        Bd69SFSConnector.getInstance().sendRequestAPP_ADD_NEW_CLUB(club);
    }

    public sendRequestAPP_REMOVE_CLUB_MANAGER(userID : number, clubID: number){
        Bd69SFSConnector.getInstance().sendRequestAPP_REMOVE_CLUB_MANAGER(userID, clubID);
    }

    public sendRequestAPP_DELETE_DORNOR(dornorID : number){
        Bd69SFSConnector.getInstance().sendRequestAPP_DELETE_DORNOR(dornorID);
    }

    public sendRequestAPP_DELETE_CLUB(clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_DELETE_CLUB(clubID);
    }

    public sendRequestAPP_GET_CLUB_INFO(clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_CLUB_INFO(clubID);
    }

    public sendRequestAPP_UPDATE_NAME_CLUB(clubID: number, name: string) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_NAME_CLUB(clubID, name);
    }

    public sendRequestAPP_UPDATE_NAME_DORNOR(dornorID : number, name : string){
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_NAME_DORNOR(dornorID, name);
    }

    public sendRequestAPP_UPDATE_LOGO_DORNOR(dornorID: number, logo: string){
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_LOGO_DORNOR(dornorID, logo);
    }

    public sendRequestAPP_UPDATE_DESCRIPTION_DORNOR(dornorID: number , description : string){
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_DESCRIPTION_DORNOR(dornorID, description);
    }

    public sendRequestAPP_UPDATE_WEBSITE_DORNOR(dornorID: number, website : string){
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_WEBSITE_DORNOR(dornorID, website);
    }

    public sendRequestAPP_UPDATE_FACEBOOK_DORNOR(dornorID: number, facebook: string){
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_FACEBOOK_DORNOR(dornorID, facebook);
    }

    public sendRequestAPP_UPDATE_YOUTUBE_DORNOR(dornorID: number, youtube: string){
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_YOUTUBE_DORNOR(dornorID, youtube);
    }

    public sendRequestAPP_GET_LIST_DORNOR(page?: number){
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_DORNOR(page? page : 0);
    }

    public sendRequestAPP_ADD_NEW_DORNOR(dornor : Dornor){
        Bd69SFSConnector.getInstance().sendRequestAPP_ADD_NEW_DORNOR(dornor);
    }

    public sendRequestAPP_UPDATE_LOGO_CLUB(clubID: number, logo: string) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_LOGO_CLUB(clubID, logo);
    }

    public sendRequestAPP_UPDATE_COVER_CLUB(clubID, cover: string) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_COVER_CLUB(clubID, cover);
    }

    public sendRequestAPP_UPDATE_CLUB_MANAGER(userID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_CLUB_MANAGER(userID, clubID);
    }

    public sendRequestAPP_UPDATE_LEAGUE_ADMIN(leagueID: number, userID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_LEAGUE_ADMIN(leagueID, userID);
    }

    public sendRequestGET_LIST_DORNOR(page?: number) {
        Bd69SFSConnector.getInstance().sendRequestGET_LIST_DORNOR(page ? page : 0);
    }

    public sendRequestAPP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN(userID?: number, page?: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_LEAGUE_OF_LEAGUE_ADMIN(userID ? userID : null, page ? page : null);
    }

    // League Stadium
    public sendRequestAPP_GET_LIST_STADIUM(page?: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_LIST_STADIUM(page);
    }

    public sendRequestAPP_ADD_NEW_STADIUM(stadium: Stadium) {
        Bd69SFSConnector.getInstance().sendRequestAPP_ADD_NEW_STADIUM(stadium);
    }

    public sendRequestAPP_DELETE_STADIUM(stadiumID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_DELETE_STADIUM(stadiumID);
    }

    public sendRequestAPP_GET_STADIUM_INFO(stadiumID: number) {
        Bd69SFSConnector.getInstance().sendRequestAPP_GET_STADIUM_INFO(stadiumID);
    }

    public sendRequestAPP_UPDATE_STADIUM_INFO_NAME(stadiumID: number, stadium: Stadium) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_STADIUM_INFO_NAME(stadiumID, stadium);
    }
    
    public sendRequestAPP_UPDATE_STADIUM_INFO_ADDRESS(stadiumID: number, stadium: Stadium) {
        Bd69SFSConnector.getInstance().sendRequestAPP_UPDATE_STADIUM_INFO_ADDRESS(stadiumID, stadium);
    }


    // Club player
    sendRequestCLUB_ADD_PLAYER_INTO_CLUB(playerID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestCLUB_ADD_PLAYER_INTO_CLUB(playerID, clubID);
    }

    sendRequestCLUB_REMOVE_PLAYER_FROM_CLUB(playerID: number, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestCLUB_REMOVE_PLAYER_FROM_CLUB(playerID, clubID);
    }

    sendRequestCLUB_GET_LIST_PLAYER(clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestCLUB_GET_LIST_PLAYER(clubID);
    }

    sendRequestCLUB_SEARCH_PLAYER(searchQuery: string, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestCLUB_SEARCH_PLAYER(searchQuery, clubID);
    }

    sendRequestCLUB_UPDATE_PLAYER_INFO(player: Player, clubID: number) {
        Bd69SFSConnector.getInstance().sendRequestCLUB_UPDATE_PLAYER_INFO(player, clubID);
    }



}