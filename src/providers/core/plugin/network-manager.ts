import { Config } from "../app/config";
import { NetworkInterface } from "@ionic-native/network-interface";
export class NetworkManager extends Config {

    protected mNetworkInterface: NetworkInterface;

    protected mWifiMacAddress: string = "";

    protected mWifiIpAddress: string = "";


    protected mWifiPublicIpAddress: string = "";



    private static _instance: NetworkManager = null;

    private constructor() {
        super();
    }

    public static getInstance(): NetworkManager {
        if (this._instance == null) {
            this._instance = new NetworkManager();
        }
        return this._instance;
    }

    public setData(data): void {
        super.setData(data);
        if("wifi_macaddress_default" in data){
            this.setWifiMacAddress(data["wifi_macaddress_default"]);
        }

        if("wifi_ip_address_default" in data){
            this.setWifiIpAddress(data["wifi_ip_address_default"]);
        }
    }

    public setNetworkInterface(networkInterface: NetworkInterface): void {
        if (!this.mNetworkInterface) {
            this.mNetworkInterface = networkInterface;
        }
    }

    public setWifiMacAddress(wifiMacAddress: string): void {
        this.mWifiMacAddress = wifiMacAddress;
    }

    public getWifiMacAddress() : string{
        return this.mWifiMacAddress;
    }
    public setWifiIpAddress(ipAddress : string) : void{
        this.mWifiIpAddress = ipAddress;
    }
    public getWifiIpAddress() : string{
        return this.mWifiIpAddress;
    }
    public setWifiPublicIpAddress(ipAddress : string) : void{
        this.mWifiPublicIpAddress = ipAddress;
    }
    public getWifiPublicIpAddress() : string{
        return this.mWifiPublicIpAddress;
    }
}