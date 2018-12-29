import { User } from "./user";

export class RequestData {

    public user: User;

    public command: String;

    public params: any;

    constructor() { }

    public getUser(): User {
        return this.user;
    }

    public setUser(user: User) {
        this.user = user;
    }

    public getParams(): any {
        return this.params;
    }

    public setParams(params: any) {
        this.params = params;
    }

    public getCommand(): String {
        return this.command;
    }

    public setCommand(command: String) {
        this.command = command;
    }
}
