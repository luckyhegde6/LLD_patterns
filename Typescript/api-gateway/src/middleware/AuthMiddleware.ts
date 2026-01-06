import { Middleware } from "./Middleware";
import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { RequestContext } from "../core/RequestContext";

export class AuthMiddleware implements Middleware {
    handle(req: Request, ctx: RequestContext, next: () => Response): Response {
        if (!req.headers["Authorization"]) {
            return new Response(401, "Unauthorized");
        }
        return next();
    }
}
