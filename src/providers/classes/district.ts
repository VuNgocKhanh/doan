import { ParamsKey } from "./paramkeys";

export class District {
    
    private districtID: number = -1;
    
    private provinceID: number = -1;
    
    private code: string = "";
    
    private name: string = "";
    
    private nameWithType: string = "";
    
    private provinceCode: string = "";
    
    private provinceName: string = "";
    
    private path: string = "";
    
    private pathWithType: string = "";
    
    private slug: string = "";
    
    constructor(){}
    public fromSFSobject(object: any) {
        if ((object == null)) {
            return;
        }
        
        if (object.containsKey(ParamsKey.DISTRICT_ID)) {
            this.setDistrictID(object.getInt(ParamsKey.DISTRICT_ID));
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
        
        if (object.containsKey(ParamsKey.PROVINCE_CODE)) {
            this.setProvinceCode(object.getUtfString(ParamsKey.PROVINCE_CODE));
        }
        
        if (object.containsKey(ParamsKey.PROVINCE_NAME)) {
            this.setProvinceName(object.getUtfString(ParamsKey.PROVINCE_NAME));
        }
        
        if (object.containsKey(ParamsKey.PATH)) {
            this.setPath(object.getUtfString(ParamsKey.PATH));
        }
        
        if (object.containsKey(ParamsKey.PATH_WITH_TYPE)) {
            this.setPathWithType(object.getUtfString(ParamsKey.PATH_WITH_TYPE));
        }
        
        if (object.containsKey(ParamsKey.SLUG)) {
            this.setSlug(object.getUtfString(ParamsKey.SLUG));
        }
        
    }

    public getDistrictID(): number {
        return this.districtID;
    }
    
    public setDistrictID(districtID: number) {
        this.districtID = districtID;
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
    
    public getProvinceCode(): string {
        return this.provinceCode;
    }
    
    public setProvinceCode(provinceCode: string) {
        this.provinceCode = provinceCode;
    }
    
    public getProvinceName(): string {
        return this.provinceName;
    }
    
    public setProvinceName(provinceName: string) {
        this.provinceName = provinceName;
    }
    
    public getPath(): string {
        return this.path;
    }
    
    public setPath(path: string) {
        this.path = path;
    }
    
    public getPathWithType(): string {
        return this.pathWithType;
    }
    
    public setPathWithType(pathWithType: string) {
        this.pathWithType = pathWithType;
    }
    
    public getSlug(): string {
        return this.slug;
    }
    
    public setSlug(slug: string) {
        this.slug = slug;
    }
}