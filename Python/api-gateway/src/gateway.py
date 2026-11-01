"""Composable API gateway primitives; HTTP servers are adapters, not domain logic."""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Callable, Protocol

@dataclass(frozen=True)
class Request:
    method: str
    path: str
    headers: dict[str, str] = field(default_factory=dict)
    body: Any = None
    tenant_id: str | None = None

@dataclass
class Response:
    status: int
    body: Any = None
    headers: dict[str, str] = field(default_factory=dict)

@dataclass
class RequestContext:
    request: Request
    principal: str | None = None
    attributes: dict[str, Any] = field(default_factory=dict)

class Middleware(Protocol):
    def __call__(self, context: RequestContext, next_handler: Callable[[RequestContext], Response]) -> Response: ...

@dataclass(frozen=True)
class Route:
    method: str
    prefix: str
    handler: Callable[[RequestContext], Response]

class Router:
    def __init__(self) -> None:
        self._routes: list[Route] = []
    def add(self, route: Route) -> None:
        self._routes.append(route)
    def resolve(self, method: str, path: str) -> Callable[[RequestContext], Response] | None:
        matches = [r for r in self._routes if r.method == method and path.startswith(r.prefix)]
        return max(matches, key=lambda r: len(r.prefix)).handler if matches else None

class ApiGateway:
    def __init__(self, router: Router, middleware: list[Middleware] | None = None) -> None:
        self.router, self.middleware = router, middleware or []
    def handle(self, request: Request) -> Response:
        context = RequestContext(request)
        def dispatch(index: int, ctx: RequestContext) -> Response:
            if index < len(self.middleware):
                return self.middleware[index](ctx, lambda c: dispatch(index + 1, c))
            handler = self.router.resolve(ctx.request.method, ctx.request.path)
            return handler(ctx) if handler else Response(404, {"error": "route_not_found"})
        return dispatch(0, context)

class RequirePrincipal:
    def __call__(self, context: RequestContext, next_handler: Callable[[RequestContext], Response]) -> Response:
        token = context.request.headers.get("authorization")
        if not token:
            return Response(401, {"error": "unauthorized"})
        context.principal = token.removeprefix("Bearer ")
        return next_handler(context)
