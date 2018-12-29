import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { Player } from '../../providers/classes/player';
import { Leagues } from '../../providers/classes/league';
import { Clubs } from '../../providers/classes/clubs';
import { User } from '../../providers/classes/user';
import { PlayerCards } from '../../providers/classes/playercards';

/**
 * Generated class for the MemberCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-card',
  templateUrl: 'member-card.html',
})
export class MemberCardPage {

  mLeagueArray : Array<Leagues> = [];
  mClub : Clubs = new Clubs();
  mPlayerArray : Array<Player> = [];
  mUser : PlayerCards = new PlayerCards();
  mListLeagues: Array<Leagues> = [];

  league = "Hanoielevent cup 2018";
  title = "Thẻ thành viên";
  name = "Họ tên:";
  club = "Câu lạc bộ:";
  birth = "Ngày sinh:";

  player_name = "Lò A Páo";
  player_club = "FC Bơi";
  player_birth = "22/02/1992";
  player_avatar = "./assets/imgs/avatar-default.jpg";

  mPlayer : Player = new Player();
  constructor(
    public mAppmodule: AppModuleProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.onLoadParams();
    this.mAppmodule._LoadAppConfig().then(()=>{
      this.mAppmodule.addBd69SFSResponeListener("MemberCardPage",respone=>{
        // this.onExtendsionRespone(respone);
      });

      // this.mAppmodule.getUserManager().sendRequestGetPlayerInLeagueInfo(this.mPlayer.getPlayerID(),this.mPlayer.getLeagueID());
    })
  }

  onLoadParams(){
    if(this.navParams.data["params"]){
      let params = this.navParams.get("params");
      this.mUser = params;
    }
  }

  ionViewWillUnload(){
    this.mAppmodule.removeSFSListener("MemberCardPage");
  }
}
