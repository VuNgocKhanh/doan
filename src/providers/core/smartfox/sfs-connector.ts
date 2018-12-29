
import { SFSEvent } from './sfs-events';
import { Config } from '../app/config';
import { Bd69SFSCmd } from '../../smartfox/bd69-sfs-cmd';

var SFS2X = window['SFS2X'];

export class SFSConnector extends Config {
    public static STATE_DISCONNECTED: number = -1;
    public static STATE_CONNECTING: number = 0;
    public static STATE_CONNECTED: number = 1;
    public static STATE_LOGGING: number = 2;
    public static STATE_LOGGED_IN: number = 3;
    public static STATE_JOINED_ROOM: number = 4;
    public static STATE_LOGGED_OUT: number = 5;

    public mSFSClient: any;
    protected mHost: string = "";
    protected mPort: number = 9933;
    protected mZone: string = "";
    protected mDebug: boolean = false;
    protected mState: number = SFSConnector.STATE_DISCONNECTED;

    constructor() {
        super();
    }

    public setSFSHost(sfshost: string): void {
        this.mHost = sfshost;
    }
    public getSFSHost(): string {
        return this.mHost;
    }
    public setSFSPort(sfsport: number): void {
        this.mPort = sfsport;
    }
    public getSFSPort(): number {
        return this.mPort;
    }
    public setSFSZone(sfszone: string): void {
        this.mZone = sfszone;
    }
    public getSFSZone(): string {
        return this.mZone;
    }
    public setSFSDebug(debug: boolean): void {
        this.mDebug = debug;
    }
    public isSFSDebugEnable(): boolean {
        return this.mDebug;
    }

    public getSFSClient() {
        return this.mSFSClient;
    }

    private initialize() {
        if (!this.mSFSClient) {
            if (SFS2X == null || SFS2X == undefined) {
                SFS2X = window['SFS2X'];
            }
            if (SFS2X) {
                this.mSFSClient = new SFS2X.SmartFox(true);
                this.mSFSClient['debug'] = this.mDebug;
            }
        }
    }
    protected setSFSState(newState: number) {
        this.mState = newState;
    }
    public getSFSState(): number {
        return this.mState;
    }
    public SFSLog(message) {
        if (!this.mDebug) return;
    }

    public connect(): Promise<any> {
        //Create mSFSClient if not exists
        this.initialize();
        return new Promise((resolve, reject) => {
            if (this.mSFSClient) {
                if (this.getSFSState() == SFSConnector.STATE_CONNECTING) {
                    return reject("Đang kết nối tới server");
                } else if (this.getSFSState() > SFSConnector.STATE_CONNECTING) {
                    return resolve("Đã kết nối tới server");
                } else if (this.getSFSState() < SFSConnector.STATE_CONNECTING) {
                    this.setSFSState(SFSConnector.STATE_CONNECTING);
                    //Connect to smartfox server
                    this.mSFSClient.connect(this.getSFSHost(), this.getSFSPort());
                    this.mSFSClient.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST);
                    this.mSFSClient.removeEventListener(SFS2X.SFSEvent.CONNECTION);
                    //If connect lost
                    this.mSFSClient.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, (eventParams) => {
                        this.onConnectionLost(eventParams.reason);
                        return reject("Ngắt kết nối smartfox" + eventParams.reason);
                    });
                    //If connect success
                    this.mSFSClient.addEventListener(SFS2X.SFSEvent.CONNECTION, (eventParams) => {
                        if (eventParams.success) {
                            this.onConnection();
                            return resolve("connect success");
                        } else {
                            this.setSFSState(SFSConnector.STATE_DISCONNECTED);
                            return reject("Không thể kết nối tới server");
                        }
                    });
                } else {
                    return resolve("Kết nối đã tồn tại");
                }
            } else {
                return reject("Không tìm thấy smartfox");
            }
        });

    }

    onExtensionResponse(data) {

    }

    public disconnect() {
        return new Promise((resolve, reject) => {
            if (this.getSFSState() < SFSConnector.STATE_CONNECTING) {
                return resolve();
            } else {
                this.mSFSClient.disconnect();
                resolve();
            }
        })
    }


    public _Disconnect() {
        return new Promise((resolve, reject) => {
            if (this.getSFSState() < SFSConnector.STATE_CONNECTING) {
                return resolve();
            } else {
                this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
                this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (reason) => {
                    this.setSFSState(SFSConnector.STATE_DISCONNECTED);
                    return resolve();
                });
                this.mSFSClient.disconnect();
            }
        });
    }

    /**Khi thiết lập được kết nối, làm một số việc linh tinh ...*/
    private onConnection() {
        // start ping to keep connection
        this.setSFSState(SFSConnector.STATE_CONNECTED);

    }

    /**
     * Smartfox events
     */

    public onConnectionLost(reason: string) {
        this.setSFSState(SFSConnector.STATE_DISCONNECTED);
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
        this.mSFSClient = null;
    }

    public send(cmd: string, params: any) {
        if (this.mSFSClient != null && this.mSFSClient.isConnected) {
            this.mSFSClient.send(new SFS2X.ExtensionRequest(cmd, params));
        }else{
        }
        this.ping();
    }

    mPingTimeOutID: NodeJS.Timer = null;
    public ping() {
        clearTimeout(this.mPingTimeOutID);
        if (this.mSFSClient != null && this.mSFSClient.isConnected) {
            this.mPingTimeOutID = setTimeout(() => {
                    this.send("zone." +Bd69SFSCmd.PING, new SFS2X.SFSObject());
            }, 5000);
        }
    }



}