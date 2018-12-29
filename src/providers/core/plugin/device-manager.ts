import { Config } from "../app/config";
import { Device } from '@ionic-native/device';
export class DeviceManager extends Config {

    protected mDevice: Device;
    protected mDeviceName: string = "";
    protected mDeviceUUID: string = "";
    protected mInMobileDevice: boolean = false;
    protected mPlatform : number = 0;
    private static _instance: DeviceManager;

    private constructor() {
        super();
    }

    public static getInstance(): DeviceManager {
        if (this._instance == null) {
            this._instance = new DeviceManager();
        }
        return this._instance;
    }
    /**0 web 1 android 2 ios */
    public setPlatform(platform : number){
        this.mPlatform = platform;
    }

    public getPlatform (): number{
        return this.mPlatform;
    }
    setData(data) {
        super.setData(data);
        if (this.mData) {
            if ('name_default' in this.mData) this.setDeviceName(this.get('name_default'));
            if ('uuid_default' in this.mData) this.setDeviceUUID(this.get('uuid_default'));
        }
    }

    public setInMobileDevice(inMobileDevice: boolean): void {
        this.mInMobileDevice = inMobileDevice;
    }

    public isInMobileDevice(): boolean {
        return this.mInMobileDevice;
    }

    public setDeviceUUID(deviceUUID: string): void {
        this.mDeviceUUID = deviceUUID;
    }
    public getDeviceUUID(): string {
        return this.mDeviceUUID;
    }
    public setDeviceName(deviceName: string): void {
        this.mDeviceName = deviceName;
    }
    public getDeviceName(): string {
        return this.mDeviceName;
    }

    public setDevice(device: Device): void {
        if (!this.mDevice) {
            this.mDevice = device;
            if (this.mDevice.manufacturer) {
                this.setDeviceName(this.mDevice.manufacturer);
                this.setDeviceUUID(this.mDevice.uuid);
            }
        }
    }
}