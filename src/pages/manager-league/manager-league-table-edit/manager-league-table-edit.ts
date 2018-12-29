import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ClubInLeague } from '../../../providers/classes/clubinleague';
import { Bd69SFSConnector } from '../../../providers/smartfox/bd69-sfs-connector';
import { Bd69SFSCmd } from '../../../providers/smartfox/bd69-sfs-cmd';
import { AppModuleProvider } from '../../../providers/app-module/app-module';
import { ParamsKey } from '../../../providers/classes/paramkeys';

/**
 * Generated class for the ManagerLeagueTableEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-league-table-edit',
  templateUrl: 'manager-league-table-edit.html',
})
export class ManagerLeagueTableEditPage {

  mListClubInLeagues: Array<ClubInLeague> = [];

  mClubInLeague: ClubInLeague = new ClubInLeague(); 

  mLeagueID: number = -1;

  mListItems: Array<{name: string,  value: string}> = [];

  constructor(
    public mAlertController: AlertController,
    public mAppModule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.onLoadParams();

  }

  onLoadParams(){
    if(this.navParams.data["params"]){
        let params = this.navParams.get("params");
        this.mLeagueID = params["leagueID"];
        this.mClubInLeague.setClubID(params["clubID"]);
        this.mClubInLeague.setLeagueID(params["leagueID"]);
    }
  }

  onLoadData(){
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_CLUB_INFO(this.mLeagueID,this.mClubInLeague.getClubID());
    Bd69SFSConnector.getInstance().sendRequestLEAGUE_GET_TABLE(this.mLeagueID);
    
  }

  ionViewDidLoad() {
    if(!this.mAppModule.isLogin){
      this.mAppModule.onSwithToLoading();
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("ManagerLeagueTableEditPage", respone => {
        this.onExtendsionRespone(respone);
      });

      this.onLoadData();
    })
  }

  ionViewWillUnload(){
    this.mAppModule.removeSFSListener("ManagerLeagueTableEditPage");
  }

  onExtendsionRespone(respone) {
    let cmd = respone.cmd;
    let params = respone.params;
    if(cmd == Bd69SFSCmd.LEAGUE_GET_CLUB_INFO){
      this.onResponeClubInfo(params);
    }
    else if(cmd == Bd69SFSCmd.LEAGUE_GET_TABLE){
      this.onParseClubInLeague(params);
    }
    else if (cmd == Bd69SFSCmd.LEAGUE_UPDATE_CLUB_INFO){
      this.onResponeUpdateClubInLeagueInfo(params);
    }
  }

  onResponeUpdateClubInLeagueInfo(params){
    this.mAppModule.hideLoading();
    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Cập nhật thông tin câu lạc bộ " + this.mClubInLeague.getName() + " thành công");
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if(content.containsKey(ParamsKey.ARRAY)){
          this.mListClubInLeagues = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY),this.mLeagueID);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onResponeClubInfo(params){
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if(content.containsKey(ParamsKey.INFO)){
          this.mClubInLeague.onFromSFSobject(content.getSFSObject(ParamsKey.INFO));
          this.onLoadListItems();
          this.mAppModule.doLogConsole("onload items ...", this.mListItems);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onParseClubInLeague(params) {
    if (params.getInt(ParamsKey.STATUS) == 1) {
      let content = params.getSFSObject(ParamsKey.CONTENT);
      if (content) {
        if(content.containsKey(ParamsKey.ARRAY)){
          this.mListClubInLeagues = this.mAppModule.getLeagueManager().onParseClubInLeagueSFSArray(content.getSFSArray(ParamsKey.ARRAY));
          this.mAppModule.doLogConsole("list club in leagues ",this.mListClubInLeagues);
        }
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  } 

  onClickItem(item){
    let alert = this.mAlertController.create();
    alert.setTitle("Cập nhật " + item.name);
    alert.setSubTitle(item.vale);
    alert.addInput({
      type: "number",
      value: item.value,
      name: "name"
    });
    alert.addButton({
      text: "Hủy"
    });
    alert.addButton({
      text: "Cập nhật",
      handler: data=>{
        if(data.name.trim() != ""){
          item.value = data.name;
          this.onClickUpdate();
        }else{
          this.mAppModule.showToast("Không có dữ liệu để cập nhật");
        }
      }
    });
    alert.present();
  }

  onClickClub(club: ClubInLeague){
    this.mClubInLeague = club;
    this.onLoadListItems();
  }

  
  onLoadListItems(){
    this.mListItems = [
      { name: "Số trận đấu", value: this.mClubInLeague.getPlayed() + "" },
      { name: "Số trận thắng", value: this.mClubInLeague.getWon() + "" },
      { name: "Số trận thua", value: this.mClubInLeague.getLost() + "" },
      { name: "Số trận hoà", value: this.mClubInLeague.getDrawn() + "" },
      { name: "Số bàn thắng", value: this.mClubInLeague.getGoalsFor() + "" },
      { name: "Số bàn thua", value: this.mClubInLeague.getGoalsAgainst() + "" },
      { name: "Số thẻ đỏ", value: this.mClubInLeague.getRedCardNumber() + "" },
      { name: "Số thẻ vàng", value: this.mClubInLeague.getYellowCardNumber() + "" },
      { name: "Vị trí xếp hạng", value: this.mClubInLeague.getPosition() + "" }
    ];
  }

  onClickUpdate(){
    this.mClubInLeague.setPlayed(parseInt(this.mListItems[0].value));
    this.mClubInLeague.setWon(parseInt(this.mListItems[1].value));
    this.mClubInLeague.setLost(parseInt(this.mListItems[2].value));
    this.mClubInLeague.setDrawn(parseInt(this.mListItems[3].value));
    this.mClubInLeague.setGoalsFor(parseInt(this.mListItems[4].value));
    this.mClubInLeague.setGoalsAgainst(parseInt(this.mListItems[5].value));
    this.mClubInLeague.setRedCardNumber(parseInt(this.mListItems[6].value));
    this.mClubInLeague.setYellowCardNumber(parseInt(this.mListItems[7].value));
    this.mClubInLeague.setPosition(parseInt(this.mListItems[8].value));

    this.mAppModule.showLoading().then(() => {
     Bd69SFSConnector.getInstance().sendRequestLEAGUE_UPDATE_CLUB_INFO(this.mClubInLeague);
    });
  }
}
