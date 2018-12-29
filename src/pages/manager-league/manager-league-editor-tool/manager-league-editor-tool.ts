import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leagues } from '../../../providers/classes/league';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { ConstantManager } from '../../../providers/manager/constant-manager';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { ParamBuilder } from '../../../providers/core/http/param-builder';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerLeagueEditorToolPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-league-editor-tool',
  templateUrl: 'manager-league-editor-tool.html',
})
export class ManagerLeagueEditorToolPage {

  mLeague: Leagues = new Leagues();

  mListItems: Array<{id: number, name: string, icon: string, page: string}> = [];

  constructor(
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();
  }

  onLoadParams(){
    if(this.navParams.data["params"]){
      this.mLeague.setLeagueID(this.navParams.get("params"));
    }
  }

  onLoadData(){
    this.mListItems = ConstantManager.getInstance().getListLeagueEditorItems();
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_LEAGUE_INFO(this.mLeague.getLeagueID());
  }

  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(()=>{
      this.mAppModule.addBd69SFSResponeListener("ManagerLeagueEditorToolPage",respone=>{
        this.onExtendsionRespone(respone);
      });
      this.onLoadData();
    });
  }

  ionViewWillUnload(){
    this.mAppModule.removeSFSListener("ManagerLeagueEditorToolPage");
  }

  onExtendsionRespone(respone){
    let cmd = respone.cmd;
    let params = respone.params;

    if(cmd == Bd69SFSCmd.LEAGUE_GET_LEAGUE_INFO){
      this.onResponeLeagueInfo(params);
    }
  }

  onResponeLeagueInfo(params){
    if(params.getInt(ParamsKey.STATUS) == 1){
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if(content){
        if(content.containsKey(ParamsKey.INFO)){
          this.mLeague.fromSFSobject(content.getSFSObject(ParamsKey.INFO));
        }
      }
    }else{
      this.mAppModule.showParamsMessage(params);
    }
  }


  onClickOption(option){
    if(option.page){
      this.navCtrl.push(option.page, {params: this.mLeague.getLeagueID()});
    }
  }
}
