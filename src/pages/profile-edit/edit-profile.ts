import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { User } from '../../providers/classes/user';
import { Bd69SFSCmd } from '../../providers/smartfox/bd69-sfs-cmd';
import { ParamsKey } from '../../providers/classes/paramkeys';
import { CalendarDate } from '../../providers/core/calendar/calendar-date';

export interface Form {
  id: number;
  name: string;
  placeholder: string;
  value: string;
}
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  mData: User = new User();

  today = new Date();

  formList: Array<Form> = [
    { id: 0, name: "Tên:", placeholder: "Nhập tên", value: "" },
    { id: 1, name: "Ngày sinh:", placeholder: "Ngày/tháng/năm", value: "" },
    { id: 2, name: "Số điện thoại :", placeholder: "+84123456789", value: "" },
    { id: 3, name: "Slogan:", placeholder: "Giới thiệu bản thân", value: "" },
    { id: 4, name: "Mô tả:", placeholder: "Mô tả về sở thích cá nhân", value: "" },
  ];

  mDateSelected: CalendarDate = new CalendarDate();

  dateString: string = "";

  constructor(
    public mViewController: ViewController,
    public navCtrl: NavController, public navParams: NavParams, public mAppModule: AppModuleProvider) {
    this.onLoadParams();

  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.mAppModule.addBd69SFSResponeListener("EditProfilePage", respone => {
        this.onExtendsionRequest(respone);
      })
    })
  }

  onExtendsionRequest(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (cmd == Bd69SFSCmd.UPDATE_USER_INFO) {
      this.onResponeUpdateUserInfo(params);
    }
  }

  ionViewWillUnload() {
    this.mAppModule.removeSFSListener("EditProfilePage");
  }

  onResponeUpdateUserInfo(params){
    this.mAppModule.hideLoading();

    if (params.getInt(ParamsKey.STATUS) == 1) {
      this.mAppModule.showToast("Cập nhật thông tin thành công");
      this.mData.fromSFSObject(params.getSFSObject(ParamsKey.CONTENT).getSFSObject(ParamsKey.INFO));
      this.navCtrl.pop();
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onClickDate(){
    this.mAppModule.showModal("SelectDatePage",{params: this.mDateSelected},(calendardate)=>{
      if(calendardate){
        this.mDateSelected = calendardate;
        this.dateString = this.mDateSelected.getDateString();
      }
    })
  }


  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mData = this.navParams.get("params");
      this.formList[0].value = this.mData.getName();
      this.formList[1].value = this.mData.getBirthday() + "";
      if(this.mData.getBirthday() > 0){
        this.mDateSelected.setTime(new Date(this.mData.getBirthday()));
        this.dateString = this.mDateSelected.getDateString();
      }
      this.formList[2].value = this.mData.getPhone();
      this.formList[3].value = this.mData.getSlogan();
      this.formList[4].value = this.mData.getDescription();
    }
  }


  onClickSave() {
    let name, birth, phone, slogan, des = null;
    if (this.mData.getName() != this.formList[0].value) {
      name = this.formList[0].value;
    }
    let timestart = new Date(this.mDateSelected.yy + "-" + ((this.mDateSelected.mm + 1) < 10 ? "0" : "") + (this.mDateSelected.mm + 1) + "-" + (this.mDateSelected.dd < 10 ? "0" : "") + this.mDateSelected.dd);

    if (this.mData.getBirthday() != timestart.getTime()) {
      birth = timestart.getTime();
    }
    if (this.mData.getPhone() != this.formList[2].value) {
      phone = this.formList[2].value;
    }
    if (this.mData.getSlogan() != this.formList[3].value) {
      slogan = this.formList[3].value;
    }
    if (this.mData.getDescription() != this.formList[4].value) {
      des = this.formList[4].value;
    }
    if (name != null || birth != null || phone != null || slogan != null || des != null) {
      this.mAppModule.showLoading();
      this.mAppModule.getUserManager().sendRequestUpdateUserInfo(this.mData.getUserID(), null, null, name, birth, phone, slogan, des);
    }
  }
}
