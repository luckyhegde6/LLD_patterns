import { BackendService } from "./BackendService";

export class RoundRobinLoadBalancer {
    private index = 0;

    constructor(private services: BackendService[]) { }

    next(): BackendService {
        const svc = this.services[this.index];
        this.index = (this.index + 1) % this.services.length;
        return svc;
    }
}
