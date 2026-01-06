import { ApiGateway } from "../src/core/ApiGateway";
import { Router } from "../src/routing/Router";
import { Route } from "../src/routing/Route";
import { Request } from "../src/core/Request";
import { BackendService } from "../src/backend/BackendService";

test("routes request correctly", () => {
    const gateway = new ApiGateway(
        new Router([new Route("/a", "svc")]),
        [],
        { svc: new BackendService("svc") }
    );

    const res = gateway.handle(new Request("/a/test", {}));
    expect(res.status).toBe(200);
});
