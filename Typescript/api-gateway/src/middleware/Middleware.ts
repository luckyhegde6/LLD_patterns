import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { RequestContext } from "../core/RequestContext";

export interface Middleware {
    handle(
        req: Request,
        ctx: RequestContext,
        next: () => Response
    ): Response;
}
