import { Request } from "./Request";
import { Response } from "./Response";
import { Router } from "../routing/Router";
import { Middleware } from "../middleware/Middleware";
import { BackendService } from "../backend/BackendService";
import { RequestContext } from "./RequestContext";

export class ApiGateway {
    constructor(
        private router: Router,
        private middlewares: Middleware[],
        private backends: Record<string, BackendService>
    ) { }

    handle(req: Request): Response {
        const ctx = new RequestContext(crypto.randomUUID());

        let index = -1;
        const run = (): Response => {
            index++;
            if (index < this.middlewares.length) {
                return this.middlewares[index].handle(req, ctx, run);
            }

            const serviceName = this.router.resolve(req.path);
            if (!serviceName) return new Response(404, "Not Found");

            return new Response(
                200,
                this.backends[serviceName].handle(req)
            );
        };

        return run();
    }
}
