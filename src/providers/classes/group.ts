import { ParamsKey } from "./paramkeys";
import { ClubInLeague } from "./clubinleague";

export class Group {

    private groupID: number = -1;

    private leagueID: number = -1;

    private name: string = "";

    private description: string = "";

    private state: number = 0;

    private listClub: Array<ClubInLeague> = [];

    constructor() { }

    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.GROUP_ID)) {
            this.setGroupID(object.getInt(ParamsKey.GROUP_ID));
        }

        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

    }



    public getGroupID(): number {
        return this.groupID;
    }

    public setGroupID(groupID: number) {
        this.groupID = groupID;
    }

    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number) {
        this.state = state;
    }

    public getListClub(): Array<ClubInLeague> {
        return this.listClub;
    }

    public setListClub(club: Array<ClubInLeague>) {
        this.listClub = club;
    }
}

