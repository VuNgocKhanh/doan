import { ParamsKey } from "./paramkeys";
import { Utils } from "../core/app/utils";

export class Stadium {

    private stadiumID: number = -1;

    private name: string = "";

    private address: string = "";

    private type: number = -1;

    private state: number = -1;

    private logo: string = "";

    private cover: string = "";

    private hotlines: string = "";

    private districtID: number = -1;

    private lat: number = 0;

    private lng: number = 0;

    private openTime: number = 0;

    private closeTime: number = 0;

    private timeCreated: number = 0;

    public constructor() { }

    public getOpenTimeString(): string {
        if (this.openTime == 0) return "";
        let hour = Math.floor(this.openTime / 60);
        let minutes = this.openTime - hour * 60;
        return Utils.getStringNumber(hour) + " : " + Utils.getStringNumber(minutes);
    }

    public getCloseTimeString(): string {
        if (this.closeTime == 0) return "";
        let hour = Math.floor(this.closeTime / 60);
        let minutes = this.closeTime - hour * 60;
        return Utils.getStringNumber(hour) + " : " + Utils.getStringNumber(minutes);
    }

    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey("stadium_id")) {
            this.setStadiumID(object.getInt("stadium_id"));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.ADDRESS)) {
            this.setAddress(object.getUtfString(ParamsKey.ADDRESS));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.LOGO)) {
            this.setLogo(object.getUtfString(ParamsKey.LOGO));
        }

        if (object.containsKey(ParamsKey.COVER)) {
            this.setCover(object.getUtfString(ParamsKey.COVER));
        }

        if (object.containsKey(ParamsKey.HOTLINES)) {
            this.setHotlines(object.getUtfString(ParamsKey.HOTLINES));
        }

        if (object.containsKey(ParamsKey.DISTRICT_ID)) {
            this.setDistrictID(object.getInt(ParamsKey.DISTRICT_ID));
        }

        if (object.containsKey(ParamsKey.LAT)) {
            this.setLat(object.getDouble(ParamsKey.LAT));
        }

        if (object.containsKey(ParamsKey.LNG)) {
            this.setLng(object.getDouble(ParamsKey.LNG));
        }

        if (object.containsKey(ParamsKey.OPEN_TIME)) {
            this.setOpenTime(object.getInt(ParamsKey.OPEN_TIME));
        }

        if (object.containsKey(ParamsKey.CLOSE_TIME)) {
            this.setCloseTime(object.getInt(ParamsKey.CLOSE_TIME));
        }

        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

    }

    public getStadiumID(): number {
        return this.stadiumID;
    }

    public setStadiumID(stadiumID: number) {
        this.stadiumID = stadiumID;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getAddress(): string {
        return this.address;
    }

    public setAddress(address: string) {
        this.address = address;
    }

    public getType(): number {
        return this.type;
    }

    public setType(type: number) {
        this.type = type;
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number) {
        this.state = state;
    }

    public getLogo(): string {
        return this.logo;
    }

    public setLogo(logo: string) {
        this.logo = logo;
    }

    public getCover(): string {
        return this.cover;
    }

    public setCover(cover: string) {
        this.cover = cover;
    }

    public getHotlines(): string {
        return this.hotlines;
    }

    public setHotlines(hotlines: string) {
        this.hotlines = hotlines;
    }

    public getDistrictID(): number {
        return this.districtID;
    }

    public setDistrictID(districtID: number) {
        this.districtID = districtID;
    }

    public getLat(): number {
        return this.lat;
    }

    public setLat(lat: number) {
        this.lat = lat;
    }

    public getLng(): number {
        return this.lng;
    }

    public setLng(lng: number) {
        this.lng = lng;
    }

    public getOpenTime(): number {
        return this.openTime;
    }

    public setOpenTime(openTime: number) {
        this.openTime = openTime;
    }

    public getCloseTime(): number {
        return this.closeTime;
    }

    public setCloseTime(closeTime: number) {
        this.closeTime = closeTime;
    }

    public getTimeCreated(): number {
        return this.timeCreated;
    }

    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}

export class StadiumInLeague extends Stadium {
    private leagueID: number = -1;

    constructor() {
        super();
    }

    public fromSFSobject(object: any) {
        super.fromSFSobject(object);
        if ((object == null)) {
            return;
        }
        if (object.containsKey(ParamsKey.LEAGUE_ID)) {
            this.setLeagueID(object.getInt(ParamsKey.LEAGUE_ID));
        }

    }

    public getLeagueID(): number {
        return this.leagueID;
    }

    public setLeagueID(leagueID: number) {
        this.leagueID = leagueID;
    }

}