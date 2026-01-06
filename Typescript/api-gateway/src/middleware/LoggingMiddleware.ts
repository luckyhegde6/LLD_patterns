import { Middleware } from "./Middleware";
import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { RequestContext } from "../core/RequestContext";

export class LoggingMiddleware implements Middleware {
    handle(req: Request, ctx: RequestContext, next: () => Response): Response {
        console.log(`[${ctx.requestId}] ${req.path}`);
        return next();
    }
}
