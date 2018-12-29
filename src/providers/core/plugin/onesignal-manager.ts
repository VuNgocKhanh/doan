import { Config } from "../app/config";
import { OneSignal } from '@ionic-native/onesignal'
export class OneSignalManager extends Config {


    mOneSignal: OneSignal;
    mOneSignalClientID: string = "";
    private static _instance: OneSignalManager;
    private constructor() {
        super();
    }
    
    public static getInstance(): OneSignalManager {
        if (this._instance == null) {
            this._instance = new OneSignalManager();
        }
        return this._instance;
    }

    public isOneSignalEnable(): boolean {
        if (this.hasData()) {
            return this.get('enable');
        }
        return false;
    }

    public setOneSignal(onesignal: OneSignal) {
        if (!this.isOneSignalEnable()) return;

        if (!this.mOneSignal) {
            this.mOneSignal = onesignal;
            this.mOneSignal.startInit(this.get('app_id'), this.get('project_number'));
            this.mOneSignal.inFocusDisplaying(this.mOneSignal.OSInFocusDisplayOption.Notification);
            this.mOneSignal.endInit();
        }
    }

    /**Lấy về user id của one signal tương ứng với user */
    public getOneSignalClientID(): Promise<string> {
        return new Promise((resolve) => {
            if (this.mOneSignalClientID.length > 0) return resolve(this.mOneSignalClientID);
            if (this.isOneSignalEnable()) {
                this.mOneSignal.getIds().then(data => {
                    this.mOneSignalClientID = data.userId;
                    return resolve(this.mOneSignalClientID);
                }).catch(err => {
                    this.mOneSignalClientID = this.get("default_onesignal_id");
                    return resolve(this.mOneSignalClientID);
                });
            } else {
                this.mOneSignalClientID = this.get("default_onesignal_id");
                return resolve(this.mOneSignalClientID);
            }
        });
    }
    public getOneSignalID(): string {
        return this.mOneSignalClientID;
    }
    public setOneSignalClientID(id: string): void {
        if(id) this.mOneSignalClientID = id;
    }
}