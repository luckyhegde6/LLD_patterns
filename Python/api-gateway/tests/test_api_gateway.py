from src.gateway import *

def test_auth_and_routing():
 r=Router(); r.add(Route('GET','/api',lambda c:Response(200,{'user':c.principal}))); g=ApiGateway(r,[RequireBearer()])
 assert g.handle(Request('GET','/api/x')).status==401
 assert g.handle(Request('GET','/api/x',{'authorization':'Bearer demo'})).body=={'user':'demo'}
def test_404(): assert ApiGateway(Router()).handle(Request('GET','/missing')).status==404
