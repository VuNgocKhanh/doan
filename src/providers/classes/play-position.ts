import { ParamsKey } from "./paramkeys";

export class PlayerPositions{
    private positionID: number = -1;
    private code: string = "";
    private name: string = "";
    private en_name: string = "";
    constructor(){}

    onResponeSFSObject(object: any){
        if (object.containsKey(ParamsKey.POSITION_ID)) {
            this.setPositonID(object.getInt(ParamsKey.POSITION_ID));
        }
        if (object.containsKey(ParamsKey.CODE)) {
            this.setCode(object.getUtfString(ParamsKey.CODE));
        }
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }
        if (object.containsKey(ParamsKey.EN_NAME)) {
            this.setEnName(object.getUtfString(ParamsKey.EN_NAME));
        }
    }

    setPositonID(positionID: number){
        this.positionID = positionID;
    }
    getPositionID(): number{
        return this.positionID;
    }
    setCode(code: string){
        this.code = code;
    }
    getCode(): string{
        return this.code;
    }
    setName(name: string){
        this.name = name;
    }
    getName(): string{
        return this.name;
    }
    setEnName(enName: string){
        this.en_name = enName;
    }
    getEngName(): string{
        return this.en_name;
    }
}