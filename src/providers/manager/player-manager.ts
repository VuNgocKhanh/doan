import { Player } from "../classes/player";
import { ConstantManager } from "./constant-manager";
import { PlayerPositions } from "../classes/play-position";
import { Bd69SFSConnector } from "../smartfox/bd69-sfs-connector";
import { ParamsKey } from "../classes/paramkeys";

export class PlayerManager {
    mPlayers: Array<Player> = [];

    constructor() { }
    onResponeArray(sfsArray) {
        this.mPlayers = [];
        for (let i = 0; i < sfsArray.size(); i++) {
            let sfsdata = sfsArray.getSFSObject(i);
            let newPlayer = new Player();
            newPlayer.onResponeSFSObject(sfsdata);
            this.mPlayers.push(newPlayer);
        }
    }

    getPlayers(): Array<Player> {
        return this.mPlayers;
    }

    getPlayerByID(playerID: number): Player {
        let index = this.mPlayers.findIndex(player => {
            return player.getPlayerID() == playerID;
        });
        if (index > -1) {
            return this.mPlayers[index];
        } else {
            return null;
        }
    }


    onParsePlayer(params,clubID?: number, leagueID?: number): Array<Player> {
        let sfsArray = params.getSFSObject(ParamsKey.CONTENT).getSFSArray(ParamsKey.ARRAY);
        let res = [];
        if (sfsArray) {
            for (let i = 0; i < sfsArray.size(); i++) {
                let sfsdata = sfsArray.getSFSObject(i);
                let newPlayer = new Player();
                newPlayer.onResponeSFSObject(sfsdata);
                if(clubID)newPlayer.setClubID(clubID);
                if(leagueID)newPlayer.setLeagueID(leagueID);
                res.push(newPlayer);
            }
        }
        return res;
    }


}