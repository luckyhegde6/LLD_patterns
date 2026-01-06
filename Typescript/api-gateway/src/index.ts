import { ApiGateway } from "./core/ApiGateway";
import { Router } from "./routing/Router";
import { Route } from "./routing/Route";
import { Request } from "./core/Request";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { LoggingMiddleware } from "./middleware/LoggingMiddleware";
import { BackendService } from "./backend/BackendService";

const gateway = new ApiGateway(
    new Router([new Route("/users", "user-service")]),
    [new LoggingMiddleware(), new AuthMiddleware()],
    { "user-service": new BackendService("user-service") }
);

const res = gateway.handle(
    new Request("/users/123", { Authorization: "token" })
);

console.log(res);
