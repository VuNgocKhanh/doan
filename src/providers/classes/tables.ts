import { Clubs } from "./clubs";

export class Tables {
    private club: Clubs = new Clubs();
    private win: number = 0;
    private lose: number = 0;
    private played: number = 0;
    private thwart: number = 0;
    private goal_win: number = 0;
    private goal_lose: number = 0;
    private add_sub: number = 0;
    private score: number = 0;
    constructor() { }

    getClub(): Clubs{
        return this.club;
    }
}