import { User } from "./user";
import { ParamsKey } from "./paramkeys";
import { PlayerPositions } from "./play-position";
import { RoleInClub, RoleInLeague, ConstantManager } from "../manager/constant-manager";
import { PlayerRecordInLeague } from "./player_record_inleague";

export class Player extends User {
    private playerID: number = -1;
    private leagueID: number = -1;
    private clubID: number = -1;
    private role_in_club: number = RoleInClub.GUEST;
    private role_in_league: number = RoleInLeague.GUEST;
    private shirt_number: number = -1;
    private state_in_club: number = - 1;
    private nickname: string = "";
    private clubName: string = "";
    private leagueName: string = "";

    private positionID: number = -1;
    private numberAge: number = 0;

    private goal: number = 0;
    private yellow_card: number = 0;
    private red_card: number = 0;
    private numberFromTheStart = 0;
    private numberPlayed: number = 0;
    private numberAssists: number = 0;

    constructor() {
        super();
    }

    fromPlayer(player: Player) {
        this.setPlayerID(player.getPlayerID());
        this.setName(player.getName());
        this.setLeagueID(player.getLeagueID());
        this.setClubID(player.getClubID());
        this.setRoleInClub(player.getRoleInClub());
        this.setRoleInLeague(player.getRoleInLeague());
    }

    fromUser(user: User) {
        if (user.getUserID()) this.setPlayerID(user.getUserID());
        this.setName(user.getName());
        this.setAvatar(user.getAvatar());
    }

    onResponeSFSObject(object: any) {
        this.fromSFSObject(object);
        if (object.containsKey(ParamsKey.PLAYER_ID)) {
            this.setPlayerID(object.getInt(ParamsKey.PLAYER_ID));
        }
        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setPlayerID(object.getInt(ParamsKey.USER_ID));
        }
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }
        if (object.containsKey(ParamsKey.CLUB_ID)) {
            this.setClubID(object.getInt(ParamsKey.CLUB_ID));
        }
        if (object.containsKey(ParamsKey.POSITION_ID)) {
            this.setPositionID(object.getInt(ParamsKey.POSITION_ID));
        }
        if (object.containsKey(ParamsKey.ROLE)) {
            this.setRole(object.getInt(ParamsKey.ROLE));
        }
        if (object.containsKey(ParamsKey.SHIRT_NUMBER)) {
            this.setShirtNumber(object.getInt(ParamsKey.SHIRT_NUMBER));
        }
        if (object.containsKey(ParamsKey.GOAL)) {
            this.setGoal(object.getInt(ParamsKey.GOAL));
        }
        if (object.containsKey(ParamsKey.YELLOW_CARD)) {
            this.setYellowCard(object.getInt(ParamsKey.YELLOW_CARD));
        }
        if (object.containsKey(ParamsKey.RED_CARD)) {
            this.setRedCard(object.getInt(ParamsKey.RED_CARD));
        }

        if (object.containsKey(ParamsKey.ROLE_IN_CLUB)) {
            this.setRoleInClub(object.getInt(ParamsKey.ROLE_IN_CLUB));
        }
        if (object.containsKey(ParamsKey.ROLE_IN_LEAGUE)) {
            this.setRoleInLeague(object.getInt(ParamsKey.ROLE_IN_LEAGUE));
        }

        if (object.containsKey(ParamsKey.ASSIST)) {
            this.setNumberAssist(object.getInt(ParamsKey.ASSIST));
        }

        if (object.containsKey(ParamsKey.PLAYED)) {
            this.setNumberPlayed(object.getInt(ParamsKey.PLAYED));
        }

        if (object.containsKey(ParamsKey.FROM_START)) {
            this.setNumberFromTheStart(object.getInt(ParamsKey.FROM_START));
        }

        if (object.containsKey(ParamsKey.CLUB_NAME)) {
            this.setClubName(object.getUtfString(ParamsKey.CLUB_NAME));
        }

        if (object.containsKey(ParamsKey.LEAGUE_NAME)) {
            this.setLeagueName(object.getUtfString(ParamsKey.LEAGUE_NAME));
        }

    }

    onParsePlayerRecordInLeague(playerRecord: PlayerRecordInLeague){
        this.setLeagueID(playerRecord.getLeagueID());
        let name = playerRecord.getNamePlayerInForm();
        if (name) this.setName(name);
        let avatar = playerRecord.getAvatarPlayerInForm();
        if (avatar) this.setAvatar(avatar);
        let birthday = playerRecord.getBirthDay();
        if (birthday) this.setBirthday(playerRecord.getBirthDay());
        let positionID = playerRecord.getPlayerPositionID();
        if(positionID) this.setPositionID(positionID);
        let shirtNumber = playerRecord.getShirtNumber();
        if(shirtNumber) this.setShirtNumber(shirtNumber);
    }

    setClubName(clubName: string) {
        this.clubName = clubName;
    }

    getClubName(): string {
        return this.clubName;
    }

    setLeagueName(leagueName: string) {
        this.leagueName = leagueName;
    }

    getleagueName(): string {
        return this.leagueName;
    }

   
    setNumberFromTheStart(numberFromTheStart: number) {
        this.numberFromTheStart = numberFromTheStart;
    }
    getNumberFromTheStart(): number {
        return this.numberFromTheStart;
    }

    setNumberAssist(numberAssists: number) {
        this.numberAssists = numberAssists;
    }
    getNumberAssists(): number {
        return this.numberAssists;
    }

    setNumberPlayed(numberPlayed: number) {
        this.numberPlayed = numberPlayed;
    }
    getNumberPlayed(): number {
        return this.numberPlayed;
    }

    setNumberAge(numberAge: number) {
        this.numberAge = numberAge;
    }
    getNumberAge(): number {
        return this.numberAge;
    }

    setPlayerID(playerID: number) {
        this.playerID = playerID;
    }
    getPlayerID(): number {
        return this.playerID;
    }

    setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }
    getLeagueID(): number {
        return this.leagueID;
    }
    setClubID(clubID: number) {
        this.clubID = clubID;
    }
    getClubID(): number {
        return this.clubID;
    }
    setPositionID(positionID: number) {
        this.positionID = positionID;
    }
    getPositionID(): number {
        return this.positionID;
    }

    setShirtNumber(shirtNumber: number) {
        this.shirt_number = shirtNumber;
    }
    getShirtNumber(): number {
        return this.shirt_number;
    }

    setGoal(goal: number) {
        this.goal = goal;
    }
    getGoal(): number {
        return this.goal;
    }
    setYellowCard(yellowCard: number) {
        this.yellow_card = yellowCard;
    }
    getYellowCard(): number {
        return this.yellow_card;
    }
    setRedCard(redCard: number) {
        this.red_card = redCard;
    }
    getRedCard(): number {
        return this.red_card;
    }
    setNickName(nickname: string) {
        this.nickname = nickname;
    }
    getNickName(): string {
        return this.nickname;
    }

    setRoleInClub(roleInClub: number) {
        this.role_in_club = roleInClub;
    }
    getRoleInClub(): number {
        return this.role_in_club;
    }
    setRoleInLeague(roleInLeague: number) {
        this.role_in_league = this.role_in_league;
    }
    getRoleInLeague(): number {
        return this.role_in_league;
    }
}
