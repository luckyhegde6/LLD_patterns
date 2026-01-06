export class BackendService {
    constructor(public readonly name: string) { }

    handle(request: any): any {
        return { service: this.name, data: "OK" };
    }
}
