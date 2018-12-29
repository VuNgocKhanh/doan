import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { LeagueManager } from '../../../providers/manager/league-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';
import { User, Editor } from '../../../providers/classes/user';


/**
 * Generated class for the Bd69EditorInleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-editor-inleague',
  templateUrl: 'bd69-editor-inleague.html',
})
export class Bd69EditorInleaguePage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;
  oldSearchQuery: string = "";
  page: number = 0;
  nextPage: number = 0;
  searchQuery: string = "";
  load: number = -1;
  mActionSheetOptions: Array<{ id: number, name: string }> = [];
  mLeagueID: number = -1;
  mEditorList: Array<Editor> = [];

  showTextNoEditor: boolean = true;
  showTextNoResult : boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController
  ) {
    this.onLoadParams();
    this.onLoadActionSheetOptions();
  }


  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69EditorInleaguePage", respone => {
        this.onExtendsionRespone(respone);
      });
    });
    this.onLoadData();
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if (cmd == Bd69SFSCmd.LEAGUE_GET_LIST_EDITOR) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let content = params.getSFSObject(ParamsKey.CONTENT);
        let sfsArray = content.getSFSArray(ParamsKey.ARRAY);
        let leagueID = content.getInt(ParamsKey.LEAGUE_ID);
        if (content) {
          if (content.containsKey(ParamsKey.NEXT)) {
            this.nextPage = content.getInt(ParamsKey.NEXT);
          } else {
            this.nextPage = -1;
          }
          this.page = content.getInt(ParamsKey.PAGE);

          if (content.containsKey(ParamsKey.ARRAY)) {
            // let mDornors = this.mAppModule.getUserManager().onResponeUserSFSArray(content.getSFSArray(ParamsKey.ARRAY));
            let mEditor = LeagueManager.getInstance().onResponeEditorSFSArray(sfsArray, leagueID);
            if (this.page < 1) {
              this.mEditorList = [];
              this.mEditorList = mEditor;
            } else {
              this.mEditorList = this.mEditorList.concat(mEditor);
            }

            if(this.mEditorList.length == 0){
              if(this.searchQuery.trim() == ""){
                this.showTextNoEditor = true;
                this.showTextNoResult = false;
              }else{
                this.showTextNoEditor = false;
                this.showTextNoResult = true;
              }
            }
          }
        }

        // this.mEditorList = LeagueManager.getInstance().onResponeEditorSFSArray(sfsArray,leagueID);

      } else {
        this.mAppModule.showParamsMessage(params);
      }
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_EDITOR) {
      this.mAppModule.hideLoading();
      if (params.getInt(ParamsKey.STATUS) == 1) {
        let userID = params.getSFSObject(ParamsKey.CONTENT).getInt(ParamsKey.USER_ID);

        let newIndex = this.mEditorList.findIndex(user => {
          return user.getUserID() == userID;
        })
        if (newIndex > -1) {
          this.mEditorList.splice(newIndex, 1);
          this.mAppModule.showToast("Hủy giám sát viên thành công");
        }

        if(this.mEditorList.length == 0){
          this.showTextNoEditor = true;
          this.showTextNoResult = false;
        }
      }
      else {
        this.mAppModule.showParamsMessage(params);
      }
    }
  }

  onLoadData() {
    LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_EDITOR(this.mLeagueID, null, this.nextPage);
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.mLeagueID = this.navParams.get('params');
    }
  }

  onLoadActionSheetOptions() {
    this.mActionSheetOptions = [
      { id: 1, name: "Cập nhật thông tin" },
      { id: 2, name: "Huỷ làm giám sát viên" }
    ];
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69EditorInleaguePage");
  }

  ionViewDidEnter() {
    if (this.load == 1) {
      LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_EDITOR(this.mLeagueID);
    }

  }

  onClickAdd() {
    this.load = 1;
    this.navCtrl.push("Bd69EditorInleagueAddPage", { params: this.mLeagueID });
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.nextPage = 0;
      this.onLoadData();
    }
  }

  clearQuery(){
    this.searchQuery = "";
    this.nextPage = 0;
    this.onLoadData();
  }

  onClickSearch(infinite?: boolean) {
    if (this.searchQuery.trim() != "") {
      if (this.oldSearchQuery != this.searchQuery) {
        this.nextPage = 0;
        this.page = 0;
        this.oldSearchQuery = this.searchQuery;
      }
      if (this.nextPage == -1) return;

      if (infinite) {
        this.mAppModule.showLoading().then(() => {
          LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_EDITOR(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_EDITOR(this.mLeagueID, this.searchQuery, this.nextPage);
      }

    }
  }

  onClickItem(editor: Editor) {
    this.mAppModule.showActionSheet(editor.getName(), this.mActionSheetOptions, (id) => {
      if (id) {
        if (id == 1) {
          this.onUpdateEditorInfo(editor);
          // LeagueManager.getInstance().sendRequestLEAGUE_GET_REFEREE_INFO(referee.getRefereeID());
        } else {
          this.mAppModule.showLoading().then(() => {
            LeagueManager.getInstance().sendRequestLEAGUE_REMOVE_EDITOR(editor.getUserID(), this.mLeagueID);
          });
        }
      }
    })

  }

  onUpdateEditorInfo(editor: Editor) {
    let mAlert = this.mAlertController.create();
    mAlert.setTitle("Cập nhật thông tin giám sát viên");
    mAlert.setSubTitle("Tên");
    mAlert.addInput({
      type: 'text',
      value: editor.getName(),
      name: 'editorName'
    });
    mAlert.addButton("Hủy");
    mAlert.addButton({
      text: "Lưu",
      handler: data => {
        if (data.editorName.trim() == "") {
          this.mAppModule.showToast("Tên giám sát viên không thể bỏ trống");
        }
        editor.setName(data.editorName);
        editor.setPhone(data.editorPhone);
        // LeagueManager.getInstance().sendRequestLEAGUE_UPDATE_EDITOR_INFO(this.mLeagueID, editor.getUserID(), 0)
      }
    });
    mAlert.present();
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onLoadData();
      infiniteScroll.complete();
    }, 1500);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      if (this.searchQuery != "") {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, this.searchQuery, this.nextPage);
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_GET_LIST_DORNOR(this.mLeagueID, null, this.nextPage);
      }
      refresher.complete();
    }, 2000);
  }

}
