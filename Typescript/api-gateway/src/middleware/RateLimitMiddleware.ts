import { Middleware } from "./Middleware";
import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { RequestContext } from "../core/RequestContext";

export class RateLimitMiddleware implements Middleware {
    handle(_: Request, __: RequestContext, next: () => Response): Response {
        return next(); // stubbed
    }
}
