import { ParamsKey } from "./paramkeys";
import { Utils } from "../core/app/utils";

export class Notification {

    private notificationID: number = -1;

    private userID: number = -1;

    private senderID: number = -1;

    private senderName: String = "";

    private senderAvatar: String = "";

    private message: String = "";

    private type: number = -1;

    private state: number = -1;

    private targetID: number = -1;

    private targetName: String = "";

    private targetAvatar: String = "";

    private timeCreated: number = 0;

    constructor() { }
    
    getTime(): string{
        return Utils.getTimeNotification(new Date(this.timeCreated));
    }

    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.NOTIFICATION_ID)) {
            this.setNotificationID(object.getInt(ParamsKey.NOTIFICATION_ID));
        }

        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setUserID(object.getInt(ParamsKey.USER_ID));
        }

        if (object.containsKey(ParamsKey.SENDER_ID)) {
            this.setSenderID(object.getInt(ParamsKey.SENDER_ID));
        }

        if (object.containsKey(ParamsKey.SENDER_NAME)) {
            this.setSenderName(object.getUtfString(ParamsKey.SENDER_NAME));
        }

        if (object.containsKey(ParamsKey.SENDER_AVATAR)) {
            this.setSenderAvatar(object.getUtfString(ParamsKey.SENDER_AVATAR));
        }

        if (object.containsKey(ParamsKey.MESSAGE)) {
            this.setMessage(object.getUtfString(ParamsKey.MESSAGE));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.TARGET_ID)) {
            this.setTargetID(object.getInt(ParamsKey.TARGET_ID));
        }

        if (object.containsKey(ParamsKey.TARGET_NAME)) {
            this.setTargetName(object.getUtfString(ParamsKey.TARGET_NAME));
        }

        if (object.containsKey(ParamsKey.TARGET_AVATAR)) {
            this.setTargetAvatar(object.getUtfString(ParamsKey.TARGET_AVATAR));
        }

        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

    }

    public getNotificationID(): number {
        return this.notificationID;
    }

    public setNotificationID(notificationID: number) {
        this.notificationID = notificationID;
    }

    public getUserID(): number {
        return this.userID;
    }

    public setUserID(userID: number) {
        this.userID = userID;
    }

    public getSenderID(): number {
        return this.senderID;
    }

    public setSenderID(senderID: number) {
        this.senderID = senderID;
    }

    public getSenderName(): String {
        return this.senderName;
    }

    public setSenderName(senderName: String) {
        this.senderName = senderName;
    }

    public getSenderAvatar(): String {
        return this.senderAvatar;
    }

    public setSenderAvatar(senderAvatar: String) {
        this.senderAvatar = senderAvatar;
    }

    public getMessage(): String {
        return this.message;
    }

    public setMessage(message: String) {
        this.message = message;
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

    public getTargetID(): number {
        return this.targetID;
    }

    public setTargetID(targetID: number) {
        this.targetID = targetID;
    }

    public getTargetName(): String {
        return this.targetName;
    }

    public setTargetName(targetName: String) {
        this.targetName = targetName;
    }

    public getTargetAvatar(): String {
        return this.targetAvatar;
    }

    public setTargetAvatar(targetAvatar: String) {
        this.targetAvatar = targetAvatar;
    }

    public getTimeCreated(): number {
        return this.timeCreated;
    }

    public setTimeCreated(timeCreated: number) {
        this.timeCreated = timeCreated;
    }
}