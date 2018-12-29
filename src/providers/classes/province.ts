import { ParamsKey } from "./paramkeys";

export class Province {
    
    private provinceID: number = -1;
    
    private code: string = "";
    
    private name: string = "";
    
    private nameWithType: string = "";
    
    private slug: string = "";
    
   constructor(){}
    
    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }
        
        if (object.containsKey(ParamsKey.PROVINCE_ID)) {
            this.setProvinceID(object.getInt(ParamsKey.PROVINCE_ID));
        }
        
        if (object.containsKey(ParamsKey.CODE)) {
            this.setCode(object.getUtfString(ParamsKey.CODE));
        }
        
        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }
        
        if (object.containsKey(ParamsKey.NAME_WITH_TYPE)) {
            this.setNameWithType(object.getUtfString(ParamsKey.NAME_WITH_TYPE));
        }
        
        if (object.containsKey(ParamsKey.SLUG)) {
            this.setSlug(object.getUtfString(ParamsKey.SLUG));
        }
        
    }
    
   
    
    public getProvinceID(): number {
        return this.provinceID;
    }
    
    public setProvinceID(provinceID: number) {
        this.provinceID = provinceID;
    }
    
    public getCode(): string {
        return this.code;
    }
    
    public setCode(code: string) {
        this.code = code;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public setName(name: string) {
        this.name = name;
    }
    
    public getNameWithType(): string {
        return this.nameWithType;
    }
    
    public setNameWithType(nameWithType: string) {
        this.nameWithType = nameWithType;
    }
    
    public getSlug(): string {
        return this.slug;
    }
    
    public setSlug(slug: string) {
        this.slug = slug;
    }
}