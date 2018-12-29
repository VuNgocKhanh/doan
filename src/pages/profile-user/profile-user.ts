import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';
import { Leagues } from '../../providers/classes/league';
import { RecordItems } from '../../providers/classes/recorditem';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { RoleInLeague, ConstantManager, UploadType, LeagueState } from '../../providers/manager/constant-manager';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { PlayerPositions } from '../../providers/classes/play-position';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { PlayerCards } from '../../providers/classes/playercards';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';
import { normalizeURL } from 'ionic-angular';

export interface FormModel {
  item: RecordItems;
  value: any;
  type: string;
}

@IonicPage()
@Component({
  selector: 'page-profile-user',
  templateUrl: 'profile-user.html',
})


export class ProfileUserPage {
  /**user = 1 league-manager = 2 club-manager = 3 */
  role: number = 2;
  /**0 edit 1 no edit */
  typeLeague: number = 0;

  leagueID: number = -1;

  mPlayerCard: PlayerCards = new PlayerCards();

  mLeague: Leagues = new Leagues();

  mListItemChecked: Array<RecordItems> = [];

  mListItemModel: Array<FormModel> = [];

  isHaveAvatar: boolean = false;

  isHaveCMND: boolean = false;

  avatar: string = "";

  imageCMNDForce: string = "";

  selectedFileCMNDForce: any;

  imageCMNDForceFileName: string = "";

  imageCMNDBack: string = "";

  selectedFileCMNDBack: any;

  imageCMNDBackFileName: string = "";

  mRoleOfUserInLeague: number = RoleInLeague.GUEST;

  mArrayValue: Array<any> = [];

  mDatas: any = null;

  options: Array<PlayerPositions> = [];

  selectedFile: any;

  avatarFileName: string = "";

  isValidate: boolean = false;

  isRequired: boolean = false;

  isUploadCMNDAvatar: boolean = false;

  isUploadCMNDForce: boolean = false;

  isUploadCMNDBack: boolean = false;

  stateLeague: number = LeagueState.INCOMING;

  playerID: number = this.mAppModule.getUserManager().getUser().getUserID();

  clubID: number = -1;

  isEdit: boolean = true;

  constructor(
    private mViewController: ViewController,
    public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider) {
    this.onLoadParams();
    this.options = ConstantManager.getInstance().getPlayersPosition();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.leagueID = this.navParams.get("params");
      this.isEdit = false;
    } else if (this.navParams.data["players"]) {
      this.isEdit = true;
      let params = this.navParams.get("players");
      this.leagueID = params["leagueID"];
      this.playerID = params["playerID"];
      if(params["clubID"])this.clubID = params["clubID"];
    }

    if (this.navParams.data["role"]) {
      this.role = this.navParams.get("role");
    }

    this.stateLeague = this.mAppModule.getLeagueManager().checkStateOfLeague(this.leagueID);
  }

  onLoadData() {
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_PLAYER_FORM(this.leagueID);
    if (this.isEdit) {
      if (this.role == 1) {
        /**User  */
        Bd69SFSConnector.getInstance().sendRequestGetPlayerFormInLeague(this.leagueID, this.playerID);
      } else if (this.role == 2) {
        /**League-manager */
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_PLAYER_FORM_DATA(this.leagueID, this.playerID);
      } else {
        /**Club manager */
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_GET_PLAYER_FORM_DATA(this.clubID,this.leagueID, this.playerID);
      }
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {

      Bd69SFSConnector.getInstance().addListener("ProfileUserPage", respone => {
        this.onExtendsionRepone(respone);
      })
      this.onLoadData();
    })

  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("ProfileUserPage");
  }

  onExtendsionRepone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_GET_PLAYER_FORM) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.onParseSFSData(params);
      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_GET_PLAYER_FORM_DATA) {
      this.onResponeGetPlayerFormInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.GET_PLAYER_FORM_IN_LEAGUE) {
      this.onResponeGetPlayerFormInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_GET_PLAYER_FORM_DATA) {
      this.onResponeGetPlayerFormInLeague(params);
    }

    else if (cmd == Bd69SFSCmd.UPDATE_PLAYER_FORM_DATA) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.onUpdateDataSucess(params);
      } else {
        this.onUpdateDataFail(params);
      }
    }

    else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_PLAYER_FORM_DATA) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.onUpdateDataSucess(params);
      } else {
        this.onUpdateDataFail(params);
      }
    }

    else if (cmd == Bd69SFSCmd.LEAGUE_CLUB_UPDATE_PLAYER_FORM_DATA) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.onUpdateDataSucess(params);
      } else {
        this.onUpdateDataFail(params);
      }
    }

    else if (cmd == Bd69SFSCmd.UPLOAD_IMAGE) {
      this.onResponeUploadImage(params);
    }
  }

  getChange($event) {
    console.log("ion select", $event);
    if ($event > -1) {
      this.isValidate = false;
    } else {
      this.checkIsValidate();
    }
  }


  onResponeGetPlayerFormInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.INFO)) {
          this.mPlayerCard.onResponeSFSObject(content.getSFSObject(ParamsKey.INFO));
          this.mPlayerCard.onParseData();

          if (this.mPlayerCard.getMDatas()) {
            this.mListItemModel = this.mPlayerCard.getMDatas().data;
          } else {
            this.onMergeDataUser();
          }


          this.mCalendarDate.setDateFromString(this.mPlayerCard.getBirthday());
          if (this.isHaveAvatar) this.avatar = this.mPlayerCard.getAvatar();
          if (this.isHaveCMND && this.mPlayerCard.getMDatas()) {
            this.imageCMNDForce = this.mPlayerCard.getMDatas().imageCMNDForce;
            this.imageCMNDBack = this.mPlayerCard.getMDatas().imageCMNDBack;
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }

  }



  onResponeUploadImage(params) {

    if (params.getInt(ParamsKey.STATUS) == 1) {

      let type = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.TYPE);

      let key = params.getSFSObject(ParamsKey.CONTENT).getUtfString("__key");

      let array = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);

      if (array && array.getSFSObject(0)) {

        let url = array.getSFSObject(0).getUtfString(ParamsKey.URL);

        if (type == UploadType.AVATAR) {
          this.avatar = this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url;
          this.isUploadCMNDAvatar = false;
        } else if (type == UploadType.RECORD) {

          if (key == "force") {
            this.imageCMNDForce = this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url;
            this.isUploadCMNDForce = false;
          } else if (key == "back") {
            this.imageCMNDBack = this.mAppModule.getResouresPath() + Bd69SFSConnector.getInstance().getSFSHost() + ":" + Bd69SFSConnector.getInstance().getSFSPort() + "/" + url;
            this.isUploadCMNDBack = false;
          }

        }

        if (!this.isHaveCMND) {
          let databody = {
            data: this.mListItemModel,
            avatar: this.avatar,
            imageCMNDForce: "",
            imageCMNDBack: ""
          };
          this.mAppModule.hideLoading();
          this._updateProfileUser(databody);
        } else {
          if (!this.isUploadCMNDForce && !this.isUploadCMNDBack && !this.isUploadCMNDAvatar) {
            let databody = {
              data: this.mListItemModel,
              avatar: this.avatar,
              imageCMNDForce: this.imageCMNDForce,
              imageCMNDBack: this.imageCMNDBack
            };
            this.mAppModule.hideLoading();
            this._updateProfileUser(databody);
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseSFSData(params) {
    let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ITEMS);
    if (sfsArray) {
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsdata = sfsArray.getSFSObject(i);
        let newRecordItem = new RecordItems();
        newRecordItem.fromSFSObject(sfsdata);
        this.mListItemChecked.push(newRecordItem);
      }
      this.onLoadChecked();
      this.onMergeDataUser();

    }
  }

  goToEditProfile() {
    this.mAppModule.showModalIonic("EditProfileUsersPage", { params: { leagueID: this.leagueID, listChecked: this.mListItemChecked } }, (data) => {
      if (data) {
        this.mListItemChecked = data;
        this.onLoadChecked();
        this.avatar = "";
        this.imageCMNDBack = "";
        this.imageCMNDForce = "";
      }
    })
  }

  onLoadChecked() {
    this.isHaveAvatar = false;
    this.isHaveCMND = false;
    this.mListItemModel = [];
    this.mListItemChecked.forEach(element => {
      if (element.getType() == 2) {
        this.isHaveAvatar = true;
      } else if (element.getType() == 14) {
        this.isHaveCMND = true;
      }
      else {
        let type = "text";
        if (element.getType() == 6 || element.getType() == 13) {
          type = "number";
        }
        this.mListItemModel.push({
          item: element,
          value: "",
          type: type
        })
      }
    });
  }

  onClickSave() {

    if (DeviceManager.getInstance().isInMobileDevice()) {

      if (this.stateLeague == LeagueState.INCOMING) {
        /**Upload Avatar */
        if (this.isHaveAvatar && !this.avatar.startsWith("http")) {
          this.isUploadCMNDAvatar = true;

          UploadFileModule.getInstance()._onUploadFileInDevice(this.avatar, this.avatarFileName, UploadType.AVATAR, "true").then((res) => {

          }).catch(err => {
            this.mAppModule.showToast(err);
          });
        } else {
          this.isUploadCMNDAvatar = false;
        }
        if (this.isHaveCMND) {
          /**Upload cmnd  */
          if (!this.imageCMNDForce.startsWith("http")) {
            this.isUploadCMNDForce = true;
            UploadFileModule.getInstance()._onUploadFileInDevice(this.imageCMNDForce, this.imageCMNDForceFileName, UploadType.RECORD, "true", "force").then((res) => {

            }).catch(err => { });
          } else {
            this.isUploadCMNDForce = false;
          }

          if (!this.imageCMNDBack.startsWith("http")) {
            this.isUploadCMNDBack = true;
            UploadFileModule.getInstance()._onUploadFileInDevice(this.imageCMNDBack, this.imageCMNDBackFileName, UploadType.RECORD, "true", "back").then((res) => {

            }).catch(err => {
              this.mAppModule.showToast(err);
            });
          } else {
            this.isUploadCMNDBack = false;
          }
        } else {
          this.isUploadCMNDBack = false;
          this.isUploadCMNDForce = false;
        }
      }
      else if (this.stateLeague == LeagueState.BEGAN) {
        this.mAppModule.showToast("Giải đấu đang diễn ra");
      }
      else if (this.stateLeague == LeagueState.STOP) {
        this.mAppModule.showToast("Giải đấu đã kết thúc");
      }
      else {
        this.mAppModule.showToast("Giải đấu đã bị hủy bỏ");
      }

    } else {

      if (this.isHaveAvatar && !this.avatar.startsWith("http")) {
        this.isUploadCMNDAvatar = true;
        UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFile, UploadType.AVATAR, "true").then((data) => {
          if (data) {
            this.mAppModule.doLogConsole("Upload image data ...", data);
          }
        }).catch(err => {
          this.isUploadCMNDAvatar = false;
          this.mAppModule.showParamsMessage(err);
          this.mAppModule.hideLoading();
        })
      } else {
        this.isUploadCMNDAvatar = false;
      }
      if (this.isHaveCMND) {
        if (!this.imageCMNDForce.startsWith("http")) {
          this.isUploadCMNDForce = true;
          UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFileCMNDForce, UploadType.RECORD, "true", "force").then((data) => {

          }).catch(err => {
            this.mAppModule.showToast(err);
            this.isUploadCMNDForce = false;
            this.mAppModule.hideLoading();
          })
        } else {
          this.isUploadCMNDForce = false;
        }

        if (!this.imageCMNDBack.startsWith("http")) {
          this.isUploadCMNDBack = true;

          UploadFileModule.getInstance()._onUploadFileInBrowser(this.selectedFileCMNDBack, UploadType.RECORD, "true", "back").then((data) => {
          }).catch(err => {
            this.mAppModule.showToast(err);
            this.isUploadCMNDBack = false;
            this.mAppModule.hideLoading();
          })
        } else {
          this.isUploadCMNDBack = false;

        }

      } else {
        this.isUploadCMNDBack = false;
        this.isUploadCMNDForce = false;
      }

    }

    let databody = {
      data: this.mListItemModel,
      avatar: this.avatar.startsWith("http") ? this.avatar : "",
      imageCMNDForce: this.imageCMNDForce.startsWith("http") ? this.imageCMNDForce : "",
      imageCMNDBack: this.imageCMNDBack.startsWith("http") ? this.imageCMNDBack : ""
    };

    this._updateProfileUser(databody);
  }

  _updateProfileUser(databody) {
    this.mAppModule.showLoading().then(() => {
      if (this.role == 1) {
        Bd69SFSConnector.getInstance().sendRequestUpdatePlayerFormData(this.leagueID, JSON.stringify(databody));
      } else if (this.role == 2) {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_PLAYER_FORM_DATA(this.leagueID, this.playerID, JSON.stringify(databody));
      } else {
        Bd69SFSConnector.getInstance().sendRequestLEAGUE_CLUB_UPDATE_PLAYER_FORM_DATA(this.clubID,this.leagueID, this.playerID, JSON.stringify(databody));
      }
    });
  }

  onUpdateDataSucess(params) {
    this.mAppModule.hideLoading();
    if (this.isUploadCMNDAvatar || this.isUploadCMNDBack || this.isUploadCMNDForce) {
      this.mAppModule.showLoadingNoduration();
      this.mAppModule.showToast("Đang lưu ảnh...", 3000);
      return;
    }
    let content = params.getSFSObject(ParamsKey.CONTENT);
    if (content) {
      if (content.containsKey(ParamsKey.INFO)) {
        this.mViewController.dismiss(content.getSFSObject(ParamsKey.INFO));
      } else {
        this.mViewController.dismiss();
      }
    }
  }
  onUpdateDataFail(params) {
    this.mAppModule.showParamsMessage(params);
  }

  onClickAddImageCMNDForce() {
    if (!this.isEdit) return;

    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFileCMNDForce = res.selectedFile;
          this.imageCMNDForce = res.avatar;
          this.checkIsValidate();

        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload avatar", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType >= 0) {
          UploadFileModule.getInstance()._onTakeAPhoto(sourceType).then((res) => {
            if (res) {
              this.imageCMNDForceFileName = res.imageFileName;
              this.imageCMNDForce = res.imageURI;
              this.checkIsValidate();
            }
          })
        }
      })
    }
  }

  onClickAddImageCMNDBack() {
    if (!this.isEdit) return;

    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFileCMNDBack = res.selectedFile;
          this.imageCMNDBack = res.avatar;
          this.checkIsValidate();

        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload avatar", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType >= 0) {
          UploadFileModule.getInstance()._onTakeAPhoto(sourceType).then((res) => {
            if (res) {
              this.imageCMNDBackFileName = res.imageFileName;
              this.imageCMNDBack = res.imageURI;
              this.checkIsValidate();

            }
          })
        }
      })
    }
  }

  onClickAvatar() {
    if (!this.isEdit) return;
    if (!DeviceManager.getInstance().isInMobileDevice()) {
      UploadFileModule.getInstance()._openFileInBrowser((res) => {
        if (res) {
          this.selectedFile = res.selectedFile;
          this.avatar = res.avatar;
          this.checkIsValidate();
        } else {
          this.mAppModule.showToast("Định dạng file không phải ảnh");
        }
      })
    } else {
      this.mAppModule.showActionSheet("Upload avatar", ConstantManager.getInstance().getActionSheetPictureSourceType(), (sourceType) => {
        if (sourceType >= 0) {
          UploadFileModule.getInstance()._onTakeAPhoto(sourceType).then((res) => {
            if (res) {
              this.avatarFileName = res.imageFileName;
              this.avatar = res.imageURI;
              this.checkIsValidate();
            }
          })
        }
      })
    }
  }

  onClickRemoveImageCMNDBack() {
    this.imageCMNDBack = "";
    this.imageCMNDBackFileName = "";
    this.selectedFileCMNDBack = null;
    this.isValidate = false;
  }

  onClickRemoveImageCMNDForce() {
    this.imageCMNDForce = "";
    this.imageCMNDForceFileName = "";
    this.selectedFileCMNDForce = null;
    this.isValidate = false;
  }

  checkIsValidate() {

    if (this.isRequired === false) {
      this.isValidate = false;
      console.log("no validate");

      return;
    }
    if (this.isHaveAvatar && this.avatar.length == 0) {
      this.isValidate = false;
      console.log("no avatar");
      return;
    }
    if (this.isHaveCMND && (this.imageCMNDForce.length == 0 || this.imageCMNDBack.length == 0)) {
      this.isValidate = false;
      console.log("no cmd");
      return;
    }
    for (let element of this.mListItemModel) {
      if (element.value.trim() == "") {
        console.log(element);

        this.isValidate = false;
        return;
      }
    }

    this.isValidate = true;
  }

  getValidate($event) {
    console.log("check box ", $event);
    console.log(this.isRequired);

    this.checkIsValidate();

  }

  onInput() {
    this.checkIsValidate();
  }

  mCalendarDate: CalendarDate = new CalendarDate();
  onClickDateOfBirth(item) {
    if (!this.isEdit) return;

    if (item.item.getType() == 10) {

      console.log(this.mCalendarDate);
      
      this.mAppModule.showModal("SelectDatePage", this.mCalendarDate, (selectedDate: CalendarDate) => {
        if (selectedDate) {
          if(selectedDate.dd > -1){
            this.mCalendarDate = selectedDate;
            item.value = this.mCalendarDate.getDateString();
          }
        }
      })
    }
  }

  onMergeDataUser() {
    this.mListItemModel.forEach(model => {
      if (model.item.getType() == 1) {
        model.value = this.mPlayerCard.getPlayerName();
      } else if (model.item.getType() == 10) {
        model.value = this.mPlayerCard.getBirthday();
      } else if (model.item.getType() == 3) {
        model.value = this.mPlayerCard.getClubName();
      }
    });
  }

  getNormalizeImage(url) {
    return normalizeURL(url);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }
}
