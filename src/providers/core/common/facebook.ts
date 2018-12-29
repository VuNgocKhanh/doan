import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

export class FacebookControllers {

    mEnable: boolean = true;
    private mFacebook: Facebook = null;
    private isLoggedIn: boolean = false;
    path: string = 'me?fields=id,name,birthday,picture.width(320).height(320).as(picture_large)';

    constructor() {

    }

    public setFaceBook(facebook: Facebook): void {
        this.mFacebook = facebook;
        this.getLoginStatus();
    }
    public loginWithFacebook(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mFacebook.login(['email', 'public_profile']).then((res: FacebookLoginResponse) => {
                if (res) {
                    this.getApi(this.path).then((respone) => {
                        resolve(respone);
                    }).catch((err) => {
                        reject(err);
                    })
                }
            }).catch((err) => {
                reject(err);
            })
        })
    }

    public getApi(path) {
        return this.mFacebook.api(path, []);
    }

    public getLoginStatus() {
        if (this.mEnable) {
            this.mFacebook.getLoginStatus().then((res) => {
                if (res.status === "connect") {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                }
            }).catch(err=>{})
        }
    }

    public logout(): Promise<any> {
       if(this.mEnable) return this.mFacebook.logout();
    }

    public getAccessToken(){
        return this.mFacebook.getAccessToken();
    }
}