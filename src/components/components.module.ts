import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { FormInputComponent } from './form-input/form-input';
import { ListPlayerComponent } from './list-player/list-player';
import { ListClubComponent } from './list-club/list-club';
import { MenuHoziComponent } from './menu-hozi/menu-hozi';
import { SearchTopComponent } from './search-top/search-top';
import { FormSelectComponent } from './form-select/form-select';
import { CalendarComponent } from './calendar/calendar';
import { FormCalendarComponent } from './form-calendar/form-calendar';
import { AcceptDelineComponent } from './accept-deline/accept-deline';
import { TwoSegmentComponent } from './two-segment/two-segment';
import { TimeComponent } from './time/time';
import { FormTimeComponent } from './form-time/form-time';
import { ManageLeagueComponent } from './manage-league/manage-league';
import { Bd69HeaderComponent } from './bd69-header/bd69-header';
import { Bd69TableComponent } from './bd69-table/bd69-table';
import { MatchesResultComponent } from './matches-result/matches-result';
import { ListClubRequestComponent } from './list-club-request/list-club-request';
import { InfoClubRequestComponent } from './info-club-request/info-club-request';
import { ListMemberComponent } from './list-member/list-member';
import { ListRequestComponent } from './list-request/list-request';
import { PipesModule } from '../pipes/pipes.module';
import { RuleOfLeagueComponent } from './rule-of-league/rule-of-league';
import { LeagueRoundComponent } from './league-round/league-round';
import { PlayerCardComponent } from './player-card/player-card';
import { MatchLiveComponent } from './match-live/match-live';
import { ListItemAvatarComponent } from './list-item-avatar/list-item-avatar';
import { SegmentComponent } from './segment/segment';
import { TopGoalComponent } from './top-goal/top-goal';
import { LeagueManagerOptionComponent } from './league-manager-option/league-manager-option';
import { TopCardComponent } from './top-card/top-card';
@NgModule({
    declarations: [
        CalendarComponent,
        FormSelectComponent,
        FormInputComponent,
        ListPlayerComponent,
        MenuHoziComponent,
        ListClubComponent,
        SearchTopComponent,
        FormCalendarComponent,
        AcceptDelineComponent,
        TwoSegmentComponent,
        TimeComponent,
        FormTimeComponent,
        ManageLeagueComponent,
        Bd69HeaderComponent,
        Bd69TableComponent,
        MatchesResultComponent,
        ListClubRequestComponent,
        InfoClubRequestComponent,
        ListMemberComponent,
        ListRequestComponent,
        RuleOfLeagueComponent,
        LeagueRoundComponent,
        PlayerCardComponent,
        MatchLiveComponent,
        ListItemAvatarComponent,
        SegmentComponent,
        // TableComponent,
    MatchesResultComponent,
    TopGoalComponent,
    LeagueManagerOptionComponent,
    TopCardComponent
    ],
    imports: [
        IonicModule,
        PipesModule
    ],
    exports: [
        CalendarComponent,
        FormSelectComponent,
        FormInputComponent,
        ListPlayerComponent,
        ListClubComponent,
        MenuHoziComponent,
        SearchTopComponent,
        FormCalendarComponent,
        AcceptDelineComponent,
        TwoSegmentComponent,
        TimeComponent,
        FormTimeComponent,
        ManageLeagueComponent,
        Bd69HeaderComponent,
        Bd69TableComponent,
        MatchesResultComponent,
        ListClubRequestComponent,
        InfoClubRequestComponent,
        ListMemberComponent,
        ListRequestComponent,
        RuleOfLeagueComponent,
        LeagueRoundComponent,
        PlayerCardComponent,
        MatchLiveComponent,
        ListItemAvatarComponent,
        SegmentComponent,
        // TableComponent,
    MatchesResultComponent,
    TopGoalComponent,
    LeagueManagerOptionComponent,
    TopCardComponent
    ]
})
export class ComponentsModule { }
