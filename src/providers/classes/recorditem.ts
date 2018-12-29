import { ParamsKey } from "./paramkeys";

export class RecordItems {
    private itemID: number = -1;
    private name: string = "";
    private description: string = "";
    private state: number = 0;
    private type: number = 0;
    constructor() {

    }

    fromObject(obejct: any){
        if(obejct.itemID)this.setItemID(obejct.itemID);
        if(obejct.name)this.setName(obejct.name);
        if(obejct.description)this.setDescription(obejct.description);
        if(obejct.state)this.setState(obejct.state);
        if(obejct.type)this.setType(obejct.type);
    }
    fromSFSObject(object: any) {
        if (object == null) {
            return;
        }

        if (object.containsKey(ParamsKey.ITEM_ID)) {
            this.setItemID(object.getInt(ParamsKey.ITEM_ID));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }

    }

    setItemID(itemID: number) {
        this.itemID = itemID;
    }

    setName(name: string) {
        this.name = name;
    }

    setDescription(description: string) {
        this.description = description;
    }

    setType(type: number) {
        this.type = type;
    }

    setState(state: number) {
        this.state = state;
    }

    getItemID(): number {
        return this.itemID;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getType() : number {
        return this.type ;
    }

    getState() : number {
        return this.state;
    }


}