import { ParamsKey } from "./paramkeys";

export class Device {
    
    private deviceID: number = -1;
    
    private userID: number = -1;
    
    private onesignalID: string = "";
    
    private name: string = "";
    
    private platform: number = 0;
    
    private state: number = 0;
    
    private lastLogin: number = 0;
    
    private timeCreated: number = 0;
    
    constructor(){}

    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }
        
        if (object.containsKey(ParamsKey.DEVICE_ID)) {
            this.setDeviceID(object.getInt(ParamsKey.DEVICE_ID));
        }
        
        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setUserID(object.getInt(ParamsKey.USER_ID));
        }
        
        if (object.containsKey(ParamsKey.ONESIGNAL_ID)) {
            this.setOnesignalID(object.getUtfString(ParamsKey.ONESIGNAL_ID));
        }
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfstring(ParamsKey.NAME));
        }
        
        if (object.containsKey(ParamsKey.PLATFORM)) {
            this.setPlatform(object.getInt(ParamsKey.PLATFORM));
        }
        
        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }
        
        if (object.containsKey(ParamsKey.LAST_LOGIN)) {
            this.setLastLogin(object.getLong(ParamsKey.LAST_LOGIN));
        }
        
        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }
        
    }
    
    
    public getDeviceID(): number {
        return this.deviceID;
    }
    
    public setDeviceID(deviceID: number) {
        this.deviceID = deviceID;
    }
    
    public getUserID(): number {
        return this.userID;
    }
    
    public setUserID(userID: number) {
        this.userID = userID;
    }
    
    public getOnesignalID(): string {
        return this.onesignalID;
    }
    
    public setOnesignalID(onesignalID: string) {
        this.onesignalID = onesignalID;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public setName(name: string) {
        this.name = name;
    }
    
    public getPlatform(): number {
        return this.platform;
    }
    
    public setPlatform(platform: number) {
        this.platform = platform;
    }
    
    public getState(): number {
        return this.state;
    }
    
    public setState(state: number) {
        this.state = state;
    }
    
    public getLastLogin(): number {
        return this.lastLogin;
    }
    
    public setLastLogin(lastLogin: number) {
        this.lastLogin = lastLogin;
    }
    
    public getTimeCreated(): number {
        return this.timeCreated;
    }
    
    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}