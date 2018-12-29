
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from "@angular/common/http";
import { Bd69SFSConnector } from '../../smartfox/bd69-sfs-connector';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UploadType } from "../../manager/constant-manager";

export class UploadFileModule {
    public static _instance: UploadFileModule = null;

    private mCamera: Camera = null;

    private fileTransfer: FileTransfer = null;

    public http: HttpClient = null;

    constructor() { }

    public _initiallize(camera: Camera, fileTransfer: FileTransfer, http: HttpClient) {
        this.setCamera(camera);
        this.setFileTransfer(fileTransfer);
        this.setHttp(http);
    }

    private setCamera(camera: Camera) {
        this.mCamera = camera;
    }

    private setFileTransfer(fileTransfer: FileTransfer) {
        this.fileTransfer = fileTransfer;
    }

    private setHttp(http: HttpClient) {
        this.http = http;
    }

    public static getInstance(): UploadFileModule {
        if (this._instance == null) {
            this._instance = new UploadFileModule();
        }
        return this._instance;
    }

    public _onTakeAPhoto(mPictureSourceType: PictureSourceType): Promise<{ imageURI: string, imageFileName: string }> {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.mCamera.DestinationType.FILE_URI,
            encodingType: this.mCamera.EncodingType.JPEG,
            mediaType: this.mCamera.MediaType.PICTURE,
            sourceType: mPictureSourceType,
            correctOrientation : true,
            saveToPhotoAlbum : true
        };

        return new Promise((resolve, reject) => {
            this.mCamera.getPicture(options).then((imageData) => {
                let imageURI = imageData;
                let filePath: string = imageData + "";
                let imageFileName = filePath.substr(filePath.lastIndexOf('/') + 1, filePath.length);
                // this.uploadFile();

                resolve({ imageURI: imageURI, imageFileName: imageFileName });
            }).catch(error => {
                reject(error);
            });
        })
    }

    public _onTakeAPhotoWithType(mPictureSourceType: PictureSourceType, imageUploadType : number): Promise<{ imageURI: string, imageFileName: string }> {
       let targetWidth  = 960;
       let targetHeight = 640;
       if(imageUploadType == UploadType.AVATAR || imageUploadType == UploadType.LOGO || imageUploadType == UploadType.THUMBNAIL ){
           targetWidth = 480;
           targetHeight = 480;
       }else if(imageUploadType == UploadType.PREVIEW || imageUploadType == UploadType.RECORD || imageUploadType == UploadType.NORMAL){
         targetWidth  = 960;
         targetHeight = 640;
       }else{
        targetWidth  = 960;
        targetHeight = 480;
       }
       
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.mCamera.DestinationType.FILE_URI,
            encodingType: this.mCamera.EncodingType.JPEG,
            mediaType: this.mCamera.MediaType.PICTURE,
            sourceType: mPictureSourceType,
            // correctOrientation : true,
            // saveToPhotoAlbum : true, 
            targetWidth : targetWidth,
            targetHeight : targetHeight
        };

        return new Promise((resolve, reject) => {
            this.mCamera.getPicture(options).then((imageData) => {
                let imageURI = imageData;
                let filePath: string = imageData + "";
                let imageFileName = filePath.substr(filePath.lastIndexOf('/') + 1, filePath.length);
                // this.uploadFile();

                resolve({ imageURI: imageURI, imageFileName: imageFileName });
            }).catch(error => {
                reject(error);
            });
        })
    }

    public _onUploadFileInDevice(imageURI: string, imageFileName: string, type: any, resize: string, key?: string): Promise<any> {
        const fileTransferObject: FileTransferObject = this.fileTransfer.create();

        let options: FileUploadOptions = {
            fileKey: "file_name",
            fileName: imageFileName,
            chunkedMode: false,
            mimeType: 'image/jpeg',
            headers: {},
            params: {
                "__type": type + "",
                "__resize": resize,
                "__key": key ? key : ""
            }
        };

        return new Promise((resolve, reject) => {
            fileTransferObject.upload(imageURI, "http://" + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/BlueBox/SFS2XFileUpload?sessHashId=" + Bd69SFSConnector.getInstance().getSessionToken(), options).then(data => {
                resolve(data);

            }).catch(error => {
                reject(error);
            })
        })
    }

    /**resize: true - false */
    public _onUploadFileInBrowser(selectedFile: any, type: any, resize: string,key ?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (selectedFile) {
                var formData: FormData = new FormData();
                formData.append("file", selectedFile);

                var headers: HttpHeaders = new HttpHeaders();
                headers.append('Content-Type', null);
                headers.append('Accept', 'multipart/form-data');

                var httpParams: HttpParams = new HttpParams();
                httpParams = httpParams.append('sessHashId', Bd69SFSConnector.getInstance().getSessionToken());
                httpParams = httpParams.append('__type', type + "");
                httpParams = httpParams.append('__resize', resize);
                if(key)httpParams = httpParams.append('__key', key);


                const req = new HttpRequest('POST', "http://" + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/BlueBox/SFS2XFileUpload?sessHashId=" + Bd69SFSConnector.getInstance().getSessionToken(), formData, {
                    reportProgress: true,
                    responseType: 'text',
                    params: httpParams,
                    headers: headers
                });

                this.http.request(req).subscribe(data => {
                    resolve(data);
                });

            } else {
                reject("Please select file first");
            }
        })
    }

    public _openFileInBrowser(callback: any) {
        let input = document.createElement("input");
        input.type = "file";
        input.onchange = (data) => {
            let file = input.files[0];
            if (file.type.startsWith("image")) {
                var reader = new FileReader();
                reader.addEventListener("load",(image)=>{
                    let avatar = image.target["result"];
                    callback({ selectedFile: file, avatar: avatar });
                })
                reader.readAsDataURL(file);

            } else {
                callback();
            }
        }
        document.body.appendChild(input);
        input.click();
    }
}