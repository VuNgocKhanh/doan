import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { User, Editor } from '../../../providers/classes/user';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { LeagueManager } from '../../../providers/manager/league-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../../providers/classes/paramkeys';


/**
 * Generated class for the Bd69EditorInleagueAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-editor-inleague-add',
  templateUrl: 'bd69-editor-inleague-add.html',
})
export class Bd69EditorInleagueAddPage {
  @ViewChild(Searchbar) mSearchBar: Searchbar;

  searchQuery: string = "";

  oldSearchQuery: string = "";

  nextPage: number = 0;

  showTextNoEditor: boolean = true;

  showTextNoResult: boolean = false;

  page: number = 0;
  mEditorList: Array<Editor> = [];
  mLeagueID: number = -1;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider) {
    this.onLoadParams();
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69EditorInleagueAddPage", respone => {
        this.onExtensionRespone(respone);
      });
    });
    this.onloadeddata();
  }

  onLoadParams() {
    if (this.navParams.data['params']) {
      this.mLeagueID = this.navParams.get('params');
    }
  }

  onloadeddata() {
    LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(this.mLeagueID, null, this.nextPage);
  }

  onExtensionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.LEAGUE_SEARCH_EDITOR) {
      this.onParseListEditorParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_ADD_EDITOR) {
      this.onResponeAddNewEditorParams(params);
    } else if (cmd == Bd69SFSCmd.LEAGUE_REMOVE_EDITOR) {
      this.onResponeDeleteEditorParams(params);
    }
  }

  onResponeAddNewEditorParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.USER_ID);
        let index = this.mEditorList.findIndex(user => {
          return user.getUserID() == id;
        })
        if (index > -1) {
          this.mEditorList[index].setLeagueID(this.mLeagueID);
        }
      }
      this.mAppModule.showToast("Thêm giám sát viên thành công");
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeDeleteEditorParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        let id = content.getInt(ParamsKey.USER_ID);
        let index = this.mEditorList.findIndex(editor => {
          return editor.getUserID() == id;
        })
        if (index > -1) {
          this.mEditorList[index].setLeagueID(-1);
        }
      }
      this.mAppModule.showToast("Hủy giám sát viên thành công");
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseListEditorParams(params) {
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.NEXT)) {
          this.nextPage = content.getInt(ParamsKey.NEXT);
        } else {
          this.nextPage = -1;
        }
        this.page = content.getInt(ParamsKey.PAGE);
        if (content.containsKey(ParamsKey.ARRAY)) {
          let mEditor = this.mAppModule.getLeagueManager().onResponeEditorInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
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
    } else {
      this.mAppModule.showParamsMessage(params);
    }
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
          LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(this.mLeagueID, this.searchQuery, this.nextPage);
        })
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(this.mLeagueID, this.searchQuery, this.nextPage);
      }

    }
  }

  onClickEditor(editor: Editor) {
    let options = [
      { id: 1, name: "Hủy làm giám sát viên" },
    ];
    if (editor.getLeagueID() != this.mLeagueID) {
      options[0].name = "Chọn làm giám sát viên";
    }
    this.mAppModule.showActionSheet(editor.getName(), options, (id) => {
      if (id) {
        if (id == 1) {
          if (editor.getLeagueID() == this.mLeagueID) {

            this.mAppModule.showLoading().then(() => {
              LeagueManager.getInstance().sendRequestLEAGUE_REMOVE_EDITOR(editor.getUserID(), this.mLeagueID);
            });
          } else {
            this.mAppModule.showLoading().then(() => {
              LeagueManager.getInstance().sendRequestLEAGUE_ADD_EDITOR(editor.getUserID(), this.mLeagueID);
            });
          }
        }
      }
    }
    )
  }

  onInput() {
    if (this.searchQuery.trim() == '') {
      this.nextPage = 0;
      this.onloadeddata();
    }
  }

  clearQuery(){
    this.searchQuery = "";
    this.nextPage = 0;
    this.onloadeddata();
  }

  onLoadData() {
    LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(this.mLeagueID, null, this.nextPage);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.onScroll();
      infiniteScroll.complete();
    }, 500);
  }

  onScroll() {
    if (this.nextPage > -1) {
      if (this.searchQuery.trim() == '') {
        this.onloadeddata();
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(this.mLeagueID, this.searchQuery, this.nextPage);
      }
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.mEditorList = [];
      this.nextPage = 0;
      if (this.searchQuery != "") {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(this.mLeagueID, this.searchQuery, this.nextPage);
      } else {
        LeagueManager.getInstance().sendRequestLEAGUE_SEARCH_EDITOR(this.mLeagueID, null, this.nextPage);
      }
      refresher.complete();
    }, 2000);
  }
}
