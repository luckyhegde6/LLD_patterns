from src.gateway import ApiGateway, Request, Response, Route, Router, RequirePrincipal, RequestContext

def test_routes_and_middleware():
    router=Router(); router.add(Route("GET","/v1/",lambda c: Response(200,{"principal":c.principal})))
    gateway=ApiGateway(router,[RequirePrincipal()])
    assert gateway.handle(Request("GET","/v1/items")).status == 401
    response=gateway.handle(Request("GET","/v1/items",{"authorization":"Bearer user-1"}))
    assert response.status == 200 and response.body["principal"] == "user-1"

def test_unknown_route():
    assert ApiGateway(Router()).handle(Request("GET","/missing")).status == 404
