import { PlayerPositions } from "../classes/play-position";


export const DevicePlatform = {
    WEB: 0,
    ANDROID: 1,
    IOS: 2
}



export const MatchEventType = {
    YELLOW: 0,
    RED: 1,
    GOAL: 2,
    GOALBACK: 3,
    CHANGE: 4,
    PENATY: 5,
    KICK_OFF: 6,
    FIRST_HALF_OFFSET_TIME: 7,
    BREAK_TIME: 8,
    SECOND_HALF_START: 9,
    SECOND_HALF_OFFSET_TIME: 10,
    MATCH_OVER: 11
}

export const RoleOfUserInSystem = {
    USER: 0,
    LEAGUEMANAGER: 1,
    ADMIN: 2
}


export const RoleInClub = {
    GUEST: -1,
    MEMBER: 0,
    CAPTAIN: 1,
    MANAGER: 2
}
export const RoleInLeague = {
    GUEST: -1,
    MEMBER: 0,
    LEAGUEMANAGER: 1,
    ADMIN: 2
}

export const MatchState = {
    INCOMING: 0,
    PLAYING: 1,
    FINISHED: 2,
    CANCEL: 3
}

export const LOGIN_TYPE = {
    FACEBOOK: 1,
    PHONE: 0
}

export const SEARCH_TYPE = {
    ALL: 0,
    CLUB: 1,
    LEAGUE: 2,
    USER: 3,
    STADIUM: 4,
    DONOR: 5
}

export const NotificationType = {
    REQUEST_JOIN_CLUB: 1,
    REQUEST_JOIN_CLUB_RESPONSE: 2,
    REQUEST_JOIN_LEAGUE: 3,
    REQUEST_JOIN_LEAGUE_RESPONSE: 4,
    ADD_USER_INTO_CLUB: 5,
    ADD_CLUB_INTO_LEAGUE: 6,
    ADD_PLAYER_INTO_LEAGUE: 7,
    REMOVE_PLAYER_INTO_LEAGUE: 8,
    REMOVE_CLUB_FROM_LEAGUE: 9,
    STATE_IN_CLUB_CHANGED: 10,
    PLAYER_RECORD_STATE_CHANGED: 11,
    LEAGUE_PUSH_NOTIFICATION: 12,
    LEAGUE_REMOVED: 13,
    LEAGUE_REMOVE_LEAGUE_ADMIN: 14,
    CLUB_REMOVED: 15,
    LEAGUE_ADD_LEAGUE_ADMIN: 16,
    CLUB_MANAGER_REMOVED: 17,
    CLUB_ADMIN_REMOVED: 18,
    CLUB_ADMIN_ADDED: 19,
    LEAGUE_CLUB_ADMIN_REMOVED: 20,
    LEAGUE_CLUB_ADMIN_ADDED: 21,
    LEAGUE_ADD_EDITOR: 22,
    LEAGUE_REMOVE_EDITOR: 23,
    LEAGUE_ADD_REFEREE: 24,
    LEAGUE_REMOVE_REFEREE: 25,
    SUBMIT_MATCH_RECORD: 26,
}
export const NotificationState = {
    UNREAD: 1,
    READ: 2,
    DELETED: 3
}

export const LeagueState = {
    INCOMING: 0,
    BEGAN: 1,
    STOP: 2,
    CANCEL: 3,
    DELETED: 4
}

export const RequestState = {
    DELINE: 0,
    ACCEPT: 1
}

export const StateClubInLeague = {
    JOINNED: 0,
    INVALID: 1,
    VALIDATED: 2,
    BLOCKED: 3,
    OVER: 4
}

export const PlayerRecordState = {
    CREATED: 0,
    SUBMITTED: 1,
    VALIDATED: 2,
    EDITTED: 3,
    INVALID: 4
}

export const PictureSourceType = {
    PHOTOLIBRARY: 0,
    CAMERA: 1,
    SAVEDPHOTOALBUM: 2
}


export const UploadType = {
    AVATAR: 0,
    LOGO: 1,
    COVER: 2,
    THUMBNAIL: 3,
    BANNER: 4,
    RECORD: 5,
    PREVIEW: 6,
    NORMAL: 7
}

export const DornorLevel = {
    DEFAULT_DORNOR: 0,
    DIAMOND_DORNOR: 1,
    GOLD_DORNOR: 2,
    SILVER_DORNOR: 3,
    BRONZE_DORNOR: 4
}

export class ConstantManager {
    public static _instance: ConstantManager = null;

    private mPlayerPositions: Array<PlayerPositions> = [];

    getRoleOfUserInSystem(): Array<{ id: number, name: string }> {
        return [
            { id: RoleOfUserInSystem.USER, name: "Người dùng" },
            { id: RoleOfUserInSystem.LEAGUEMANAGER, name: "Quản lí giải đấu" },
            { id: RoleOfUserInSystem.ADMIN, name: "Admin" }
        ];
    }
    getRoleOfUserInClub(): Array<{ id: number, name: string }> {
        return [
            { id: RoleInClub.GUEST, name: "Khách" },
            { id: RoleInClub.MEMBER, name: "Thành viên" },
            { id: RoleInClub.CAPTAIN, name: "Đội trưởng" },
            { id: RoleInClub.MANAGER, name: "Lãnh đội" }
        ];
    }
    getRoleOfUserInClubFormManagerAdmin(): Array<{ id: number, name: string }> {
        return [
            { id: RoleInClub.MEMBER, name: "Thành viên" },
            { id: RoleInClub.CAPTAIN, name: "Đội trưởng" },
            { id: RoleInClub.MANAGER, name: "Lãnh đội" }
        ]
    }
    getRoleOfUserInLeague(): Array<{ id: number, name: string }> {
        return [
            { id: RoleInLeague.GUEST, name: "Khách" },
            { id: RoleInLeague.MEMBER, name: "Thành viên" },
            { id: RoleInLeague.LEAGUEMANAGER, name: "Quản lí giải đấu" },
            { id: RoleInLeague.ADMIN, name: "Admin" }
        ];
    }

    getOptionForManagerAndMemberInClub(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem thông tin" },
            { id: 3, name: "Yêu cầu rời đội" }
        ];
    }

    getOptionForAdminAndMemberInClub(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem thông tin" },
            { id: 1, name: "Chọn làm quản lý" },
            { id: 3, name: "Yêu cầu rời đội" }
        ];
    }

    getOptionForAdminAndManagerInClub(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem thông tin" },
            { id: 2, name: "Huỷ làm quản lý" },
            { id: 3, name: "Yêu cầu rời đội" }
        ];
    }

    getOptionForManagerAndMemberInPlayerInfo(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem profile" },
            { id: 3, name: "Yêu cầu rời đội" }
        ];
    }

    getOptionForAdminAndMemberInPlayerInfo(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem profile" },
            { id: 1, name: "Chọn làm quản lý" },
            { id: 3, name: "Yêu cầu rời đội" }
        ];
    }

    getOptionForAdminAndManagerInPlayerInfo(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem profile" },
            { id: 2, name: "Huỷ làm quản lý" },
            { id: 3, name: "Yêu cầu rời đội" }
        ];
    }

    getOptionForManagerClub(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem thông tin" },
            { id: 1, name: "Đổi tên câu lạc bộ" },
            { id: 2, name: "Cập nhật logo" },
            { id: 3, name: "Cập nhật ảnh bìa" },
            { id: 4, name: "Cấp quyền lãnh đội" },
            { id: 5, name: "Thêm thành viên" },
            { id: 6, name: "Xóa" },
        ]
    }

    getOptionForManagerDornor(): Array<{ id: number, name: string }> {
        return [
            { id: 7, name: "Xem thông tin" },
            { id: 0, name: "Cập nhật tên" },
            { id: 1, name: "Cập nhật logo" },
            { id: 2, name: "Cập nhật mô tả" },
            { id: 3, name: "Cập nhật website" },
            { id: 4, name: "Cập nhật facebook" },
            { id: 5, name: "Cập nhật youtube" },
            { id: 6, name: "Xóa" }
        ]
    }

    getOptionForManagerStadium(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem thông tin" },
            { id: 1, name: "Đổi tên sân bóng" },
            { id: 2, name: "Cập nhật địa chỉ" },
            { id: 3, name: "Xóa" }
        ]
    }

    getActionSheetStateProfile(): Array<{ id: number, name: string }> {
        return [
            { id: StateClubInLeague.VALIDATED, name: "Đánh dấu hồ sơ hợp lệ" },
            { id: StateClubInLeague.INVALID, name: "Đánh dấu hồ sơ không hợp lệ" },
        ];
    }
    getActionSheetStatePlayerRecord(): Array<{ id: number, name: string }> {
        return [
            { id: -1, name: "Xem hồ sơ" },
            { id: PlayerRecordState.VALIDATED, name: "Đánh dấu hồ sơ hợp lệ" },
            { id: PlayerRecordState.INVALID, name: "Đánh dấu hồ sơ không hợp lệ" },
            { id: 5, name: "Xoá khỏi giải đấu" }
        ];
    }

    getActionSheetPictureSourceType(): Array<{ id: number, name: string }> {
        return [
            { id: PictureSourceType.PHOTOLIBRARY, name: "Chọn ảnh từ thư viện" },
            { id: PictureSourceType.CAMERA, name: "Camera" },
        ];
    }

    getListMatchEventType(): Array<{ id: number, name: string, color: string }> {
        return [
            { id: MatchEventType.YELLOW, name: "Thẻ vàng", color: "yellow-color" },
            { id: MatchEventType.RED, name: "Thẻ đỏ", color: "red-color" },
            { id: MatchEventType.GOAL, name: "Bàn thắng", color: "green-color" },
            { id: MatchEventType.GOALBACK, name: "Phản lưới", color: "green-color" },
            { id: MatchEventType.CHANGE, name: "Thay người", color: "orange-color" },
            { id: MatchEventType.PENATY, name: "Penalty", color: "orange-color" },
            { id: MatchEventType.KICK_OFF, name: "Bắt đầu", color: "green-color" },
            { id: MatchEventType.FIRST_HALF_OFFSET_TIME, name: "Bù giờ h1", color: "red-color" },
            { id: MatchEventType.BREAK_TIME, name: "Nghỉ", color: "green-color" },
            { id: MatchEventType.SECOND_HALF_START, name: "Bắt đầu h2", color: "green-color" },
            { id: MatchEventType.SECOND_HALF_OFFSET_TIME, name: "Bù giờ h2", color: "red-color" },
            { id: MatchEventType.MATCH_OVER, name: "Kết thúc", color: "black-color" },
        ];
    }

    getListEventTypeOnMatchInfo(): Array<{ id: number, name: string, icon: string }> {
        return [
            { id: -1, name: "Thêm sự kiện", icon: "ios-add-circle-outline" },
            { id: MatchEventType.YELLOW, name: "Thẻ vàng", icon: "./assets/png/yellow_card.png" },
            { id: MatchEventType.RED, name: "Thẻ đỏ", icon: "./assets/png/red_card.png" },
            { id: MatchEventType.GOAL, name: "Bàn thắng", icon: "./assets/png/soccer.png" },
            { id: MatchEventType.GOALBACK, name: "Phản lưới nhà", icon: "./assets/png/goal.png" },
            { id: MatchEventType.PENATY, name: "Penalty", icon: "./assets/png/penalty.png" },
            { id: MatchEventType.CHANGE, name: "Thay người", icon: "./assets/png/substitution.png" },
            { id: -2, name: "Khác", icon: "ios-more-outline" }
        ];
    }

    getListManagerAppsItems(): Array<{ id: number, name: string, icon: string, icon_color: string, page: string }> {
        return [
            { id: 0, name: "giải đấu", icon: "bd69-trophy", icon_color: "yellow", page: "ManagerLeaguesPage" },
            { id: 1, name: "đội bóng", icon: "bd69-club", icon_color: "blue", page: "ManagerClubsPage" },
            { id: 6, name: "ban tổ chức", icon: "bd69-sheild", icon_color: "orange", page: "ManagerAdminLeaguePage" },
            { id: 2, name: "sân bóng", icon: "bd69-stadium", icon_color: "green", page: "ManagerStadiumsPage" },
            { id: 3, name: "trọng tài", icon: "bd69-whistle", icon_color: "black", page: "ManagerRefereePage" },
            { id: 4, name: "nhà tài trợ", icon: "bd69-diamond", icon_color: "pinkviolet", page: "ManagerDornorsPage" },
            { id: 5, name: "lãnh đội", icon: "bd69-star", icon_color: "red", page: "ManagerCaptainsPage" },
            { id: 6, name: "Cầu thủ", icon: "bd69-player", icon_color: "green", page: "ManagerUserPage" },
        ];
    }

    getListLeagueManagerItems(): Array<{ id: number, name: string, icon: string, page: string }> {
        return [
            { id: 0, name: "Danh sách câu lạc bộ", icon: "bd69-club", page: "Bd69ClubInleaguePage" },
            { id: 5, name: "Trận đấu & kết quả", icon: "bd69-score", page: "LeagueManagerMatchesPage" },
            { id: 8, name: "Sân bóng", icon: "bd69-stadium", page: "StadiumManagerPage" },
            { id: 9, name: "Vòng đấu và bảng đấu", icon: "bd69-calendar", page: "Bd69ListRoundsPage" },
            { id: 7, name: "Danh sách cầu thủ", icon: "bd69-player", page: "Bd69PlayersInleaguePage" },
            { id: 3, name: "Đăng ký trọng tài", icon: "bd69-referee", page: "Bd69RefereeInLeaguePage" },
            { id: 8, name: "Đăng ký nhà tài trợ", icon: "bd69-diamond", page: "DonorPage" },
            { id: 2, name: "Quản lý giám sát viên", icon: "bd69-sheild", page: "Bd69EditorInleaguePage" },
            { id: 6, name: "Form đăng ký cầu thủ", icon: "bd69-profile", page: "ProfileUserPage" },
            { id: 10, name: "Tạo thông báo", icon: "bd69-bell-add", page: "ManagerLeaguePushNotificationPage" },
            { id: 1, name: "Điều lệ giải đấu", icon: "bd69-file", page: "Bd69RuleOfLeaguePage" }
        ];
    }

    getListLeagueEditorItems(): Array<{ id: number, name: string, icon: string, page: string }> {
        return [
            { id: 1, name: "Duyệt hồ sơ", icon: "bd69-club", page: "ManagerLeagueEditProfilePage" },
            { id: 5, name: "Trận đấu & kết quả", icon: "bd69-score", page: "LeagueManagerMatchesPage" },
            { id: 9, name: "Vòng đấu và bảng đấu", icon: "bd69-calendar", page: "Bd69ListRoundsPage" },
            { id: 7, name: "Danh sách cầu thủ", icon: "bd69-player", page: "Bd69PlayersInleaguePage" },
            { id: 6, name: "Form đăng ký cầu thủ", icon: "bd69-profile", page: "ProfileUserPage" }
        ];
    }

    getListManagerAdminItems(): Array<{ id: number, name: string, icon: string, page: string }> {
        return [
            { id: 0, name: "Câu lạc bộ", icon: "bd69-club", page: "ManagerAdminsClubPage" },
            { id: 1, name: "Cầu thủ", icon: "bd69-player", page: "ManagerAdminsPlayerPage" },
            { id: 2, name: "Hồ sơ", icon: "bd69-profile", page: "ManagerAdminsProfilePage" },
            { id: 3, name: "Trận đấu", icon: "bd69-score", page: "ManagerAdminsMatchPage" },
        ];
    }

    getListItemManagerMatch(): Array<{ id: number, name: string, page: string, class: string, icon: string }> {
        return [
            { id: 1, name: "Tạo mới trận đấu", page: "CreateMatchesPage", class: "green-color", icon: "bd69-match-add" },
            { id: 2, name: "Danh sách trận đấu", page: "Bd69ManagerMatchesPage", class: "red-color", icon: "bd69-match-list" },
            { id: 5, name: "Cập nhật bảng xếp hạng", page: "ManagerLeagueTablePage", class: "yellow-color", icon: "bd69-match-update" },
        ]
    }

    getEventOption(): Array<{ id: number, name: string }> {
        return [
            { id: 1, name: "Chỉnh sửa" },
            { id: 2, name: "Xoá" }
        ];
    }

    getTablesOption(): Array<{ id: number, name: string }> {
        return [
            { id: 1, name: "Toàn giải đấu" },
            { id: 2, name: "Bảng đấu" }
        ];
    }

    getMatchActionSheet(): Array<{ id: number, name: string }> {
        return [
            { id: 0, name: "Xem thông tin" },
            { id: 1, name: "Chỉnh sửa" },
            { id: 2, name: "Cập nhật kết quả" },
            { id: 3, name: "Cập nhật diễn biến" },
            { id: 4, name: "Biên bản trận đấu" },
            { id: 5, name: "Xoá" }
        ];
    }

    getMessageOfEvent(type: number): string {
        let name: string = "";
        switch (type) {
            case MatchEventType.KICK_OFF:
                name = "Trận đấu bắt đầu";
                break;
            case MatchEventType.FIRST_HALF_OFFSET_TIME:
                name = "Thời gian bù giờ hiệp 1";
                break;
            case MatchEventType.SECOND_HALF_START:
                name = "Bắt đầu hiệp 2";
                break;
            case MatchEventType.BREAK_TIME:
                name = "Nghỉ giữa trận";
                break;
            case MatchEventType.SECOND_HALF_OFFSET_TIME:
                name = "Thời gian bù giờ hiệp 2";
                break;
            case MatchEventType.MATCH_OVER:
                name = "Kết thúc trận đấu";
                break;
            default:
                name = "";
                break;
        }
        return name;
    }

    getNameOfPlayerRecordState(state: number): string {
        let name: string = "";
        switch (state) {
            case PlayerRecordState.CREATED:
                name = "Chưa cập nhật";
                break;
            case PlayerRecordState.SUBMITTED:
                name = "Đã cập nhật";
                break;
            case PlayerRecordState.VALIDATED:
                name = "Đã duyệt";
                break;
            case PlayerRecordState.EDITTED:
                name = "Đã chỉnh sửa";
                break;
            case PlayerRecordState.INVALID:
                name = "Hồ sơ không hợp lệ";
                break;
            default:
                name = "";
                break;
        }
        return name;
    }

    public static getInstance(): ConstantManager {
        if (this._instance == null) {
            this._instance = new ConstantManager();
        }
        return this._instance;
    }

    onResponePlayerPosition(mArray) {
        this.mPlayerPositions = [];
        for (let i = 0; i < mArray.size(); i++) {
            let sfsdata = mArray.getSFSObject(i);
            let newPlayerPosition = new PlayerPositions();
            newPlayerPosition.onResponeSFSObject(sfsdata);
            this.mPlayerPositions.push(newPlayerPosition);
        }
    }

    getPlayersPosition() {
        return this.mPlayerPositions;
    }

    getPlayerPositionByID(positionID: number): PlayerPositions {
        if (positionID == -1 || this.mPlayerPositions.length == 0) return null;
        let findIndex = this.mPlayerPositions.findIndex(ele => {
            return ele.getPositionID() == positionID;
        })
        if (findIndex > -1) {
            return this.mPlayerPositions[findIndex];
        } else {
            return null;
        }
    }
}

