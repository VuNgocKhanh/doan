import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Leagues } from '../../../providers/classes/league';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { RecordItems } from '../../../providers/classes/recorditem';
import { ParamsKey } from '../../../providers/classes/paramkeys';

export interface ItemModule {
  item: RecordItems;
  checked: boolean;
}

@IonicPage()
@Component({
  selector: 'page-edit-profile-users',
  templateUrl: 'edit-profile-users.html',
})
export class EditProfileUsersPage {

  mListItem: Array<ItemModule> = [];

  mListItemChecked: Array<RecordItems> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mViewController: ViewController,
    private mAppModule: AppModuleProvider
  ) {

  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.onLoadParams();

      Bd69SFSConnector.getInstance().addListener("ProfileUserPage", respone => {
        this.onExtendsionRepone(respone);
      })
      this.mAppModule.getLeagueManager().sendRequestGetPlayerRecordItemList(this.mLeague.getLeagueID());

    })
  }

  ionViewWillUnload() {
    Bd69SFSConnector.getInstance().removeListener("ProfileUserPage");
  }

  mLeague: Leagues = new Leagues();
  onLoadParams() {
    if (this.navParams.data["params"]) {
      let params = this.navParams.get("params");
      this.mLeague.setLeagueID(params["leagueID"]);
      this.mListItemChecked = params["listChecked"];
    }
  }

  onExtendsionRepone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_PLAYER_RECORD_ITEM_LIST) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.onParseSFSData(params);
      }
    }

    if (cmd == Bd69SFSCmd.UPDATE_LEAGUE_FORM_PLAYER) {
      if (params.getInt(ParamsKey.STATUS) == 1) {
        this.onSucess(params);
      }
    }
  }

  onParseSFSData(params) {
    let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
    if (sfsArray) {
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsdata = sfsArray.getSFSObject(i);
        let newRecordItem = new RecordItems();
        newRecordItem.fromSFSObject(sfsdata);

        if (newRecordItem.getState() == 1) {
          this.mListItem.push({
            item: newRecordItem,
            checked: this.onCheckedRecord(newRecordItem.getItemID())
          });
        }
      }
    }
  }

  onCheckedRecord(itemID: number) {
    if(this.mListItemChecked.length == 0 || !this.mListItemChecked)return false;
    let item = this.mListItemChecked.find(item => {
      return item.getItemID() == itemID;
    });
    if (item) {
      return true;
    } else {
      return false;
    }
  }

  onClickSave() {

    let mCheckList = this.mListItem.filter(item => {
      return item.checked === true;
    })
    let arryId = "";

    mCheckList.forEach(element => {
      arryId = arryId.concat( (arryId.trim() == '' ? "" : "-") + element.item.getItemID());
    });

    this.mAppModule.getLeagueManager().sendRequestUpdateLeagueFormPlayer(arryId, this.mLeague.getLeagueID());
  }

  onSucess(params) {
    this.mListItemChecked = [];
    let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ITEMS);
    if (sfsArray) {
      for (let i = 0; i < sfsArray.size(); i++) {
        let sfsdata = sfsArray.getSFSObject(i);
        let newRecordItem = new RecordItems();
        newRecordItem.fromSFSObject(sfsdata);
        this.mListItemChecked.push(newRecordItem);
      }
    }
    this.mViewController.dismiss(this.mListItemChecked);
  }


}
