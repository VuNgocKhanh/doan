declare var window;
export class FbAccountKitController {
    public static _intance: FbAccountKitController = null;

    constructor() {
    }

    public register(callback?: any) {
        (<any>window).AccountKitPlugin.loginWithPhoneNumber({
            useAccessToken: true,
            defaultCountryCode: "VN",
            facebookNotificationsEnabled: true,
        }, data => {
            (<any>window).AccountKitPlugin.getAccount(
                info => {
                    if (callback) callback(info);
                },
                err => callback());
        });
    }

    public logout() {
        (<any>window).AccountKitPlugin.logout();
    }

    public static _getIntance() {
        if (this._intance == null) {
            this._intance = new FbAccountKitController();
        }
        return this._intance;
    }
}

export interface AccountKitOption {
    countryCode?: string;
    phoneNumber?: string;
    emailAddress?: string;
}