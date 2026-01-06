import { Route } from "./Route";

export class Router {
    constructor(private routes: Route[]) { }

    resolve(path: string): string | null {
        const route = this.routes.find(r => path.startsWith(r.pathPrefix));
        return route?.serviceName ?? null;
    }
}
