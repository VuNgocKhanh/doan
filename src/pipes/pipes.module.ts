import { NgModule } from '@angular/core';
import { RoleInClubPipe } from './role-in-club/role-in-club';
import { Bd69CalendarDatePipe } from './bd69-calendar-date/bd69-calendar-date';
import { StateLeaguePipe } from './state-league/state-league';
import { StateRecordPipe } from './state-record/state-record';
import { PlayerInfoPipe } from './player-info/player-info';
import { PositionPlayerPipe } from './position-player/position-player';
import { EventTypePipe } from './event-type/event-type';
import { RefereeRolePipe } from './referee-role/referee-role';
import { EventColorPipe } from './event-color/event-color';
import { RoleInClubManagerAdminsPipe } from './role-in-club-manager-admins/role-in-club-manager-admins';
import { StateClubInLeaguePipe } from './state-club-in-league/state-club-in-league';
import { TypeLeaguePipe } from './type-league/type-league';
import { BindTimePipe } from './bind-time/bind-time';
@NgModule({
    declarations:[RoleInClubPipe,
            Bd69CalendarDatePipe,
            StateLeaguePipe,
            StateRecordPipe,
            PlayerInfoPipe,
            PositionPlayerPipe,
            EventTypePipe,
            RefereeRolePipe,
            EventTypePipe,
            EventColorPipe,
            RoleInClubManagerAdminsPipe,
    StateClubInLeaguePipe,
    TypeLeaguePipe,
    BindTimePipe
        ],
    imports: [],
    exports: [RoleInClubPipe,
        Bd69CalendarDatePipe,
        StateLeaguePipe,
        StateRecordPipe,
        PlayerInfoPipe,
        PositionPlayerPipe,
        EventTypePipe,
        RefereeRolePipe,
        EventTypePipe,
        EventColorPipe,
        RoleInClubManagerAdminsPipe,
    StateClubInLeaguePipe,
    TypeLeaguePipe,
    BindTimePipe]
})
export class PipesModule { }
