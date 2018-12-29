import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../providers/classes/league';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { ClubInLeague } from '../../providers/classes/clubinleague';
import { Clubs } from '../../providers/classes/clubs';
import { Group } from '../../providers/classes/group';
import { Bd69SFSConnector } from '../../providers/smartfox/bd69-sfs-connector';

/**
 * Generated class for the Bd69TablesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bd69-tables',
  templateUrl: 'bd69-tables.html',
})
export class Bd69TablesPage {

  mTables: Array<ClubInLeague> = [];

  mGroups: Array<Group> = [];

  isLoadData: number = 2;

  mLeagueID: number = -1;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mLeagueID = this.navParams.get("params");
    }
  }

  onLoadData() {
    this.mAppModule.getLeagueManager().sendRequestGetTableOfLeague(this.mLeagueID);
    this.mAppModule.getLeagueManager().sendRequestGetListGroupOfLeague(this.mLeagueID);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.onSwithToLoading();
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("Bd69TablesPage", respone => {
        this.onExtendsionRespone(respone);
      });

      this.onLoadData();

    })


  }
  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("Bd69TablesPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;

    if (cmd == Bd69SFSCmd.GET_TABLE_OF_LEAGUE) {
      this.onResponeGetTableOfLeague(params);
    } else if (cmd == Bd69SFSCmd.GET_LIST_GROUP_OF_LEAGUE) {
      this.onResponeGetListGroupOfLeague(params);
    }
  }

  onResponeGetListGroupOfLeague(params) {
    this.isLoadData--;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          this.mGroups = this.mAppModule.getLeagueManager().onParseGroupList(content.getSFSArray(ParamsKey.ARRAY));
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeGetTableOfLeague(params) {
    this.isLoadData--;
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if (content.containsKey(ParamsKey.ARRAY)) {
          if (this.mGroups.length <= 1) {
            this.mTables = this.mAppModule.getLeagueManager().onParseClubInLeagueShortSFSArray(content.getSFSArray(ParamsKey.ARRAY));
            this.mTables.sort((a, b) => {
              return b.getPoints() - a.getPoints();
            });
          } else {
            this.mTables = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
            for (let i = 0; i < this.mGroups.length; i++) {
              let group: Array<ClubInLeague> = [];
              for (let j = 0; j < this.mTables.length; j++) {
                if (this.mTables[j].getGroupID() == this.mGroups[i].getGroupID()) {
                  group.push(this.mTables[j]);
                }
              }
              this.mGroups[i].setListClub(group);

            }
          }
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.onLoadData();
      refresher.complete();
    }, 2000);
  }


}
