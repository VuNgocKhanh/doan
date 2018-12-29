import { Storage } from '@ionic/storage';

export class StorageController{
    /** Install
     * $ ionic cordova plugin add cordova-sqlite-storage
     * $ npm install --save @ionic/storage
     * $ Add to imports in app-module 
     * - IonicStorageModule.forRoot()
     */

    mStorage : Storage = null;
    constructor(){}

    public setStorage(storage: Storage){
        this.mStorage = storage;
    }

    public saveDataToStorage(key: string, value: any): Promise<any>{
        return this.mStorage.set(key,value);
    }

    public getDataFromStorage(key): Promise<any>{
        return this.mStorage.get(key);
    }

    public clearAllData():void{
        this.mStorage.clear();
    }

    public removeKeyDataFromStorage(key): Promise<any>{
        return this.mStorage.remove(key);
    }
    
}
