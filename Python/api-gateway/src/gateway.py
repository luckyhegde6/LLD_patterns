from dataclasses import dataclass,field
from typing import Any,Callable,Protocol
@dataclass(frozen=True)
class Request:
    method:str; path:str; headers:dict[str,str]=field(default_factory=dict); body:Any=None; tenant_id:str|None=None
@dataclass
class Response: status:int; body:Any=None
@dataclass
class Context: request:Request; principal:str|None=None
class Middleware(Protocol):
    def __call__(self,c:Context,n:Callable[[Context],Response])->Response: ...
@dataclass(frozen=True)
class Route: method:str; prefix:str; handler:Callable[[Context],Response]
class Router:
    def __init__(self): self.routes=[]
    def add(self,r:Route): self.routes.append(r)
    def resolve(self,m,p):
        found=[r for r in self.routes if r.method==m and p.startswith(r.prefix)]
        return max(found,key=lambda r:len(r.prefix)).handler if found else None
class RequireBearer:
    def __call__(self,c,n):
        token=c.request.headers.get('authorization')
        if not token: return Response(401,{'error':'unauthorized'})
        c.principal=token.removeprefix('Bearer '); return n(c)
class ApiGateway:
    def __init__(self,router:Router,middleware:list[Middleware]|None=None): self.router=router; self.middleware=middleware or []
    def handle(self,request:Request)->Response:
        def run(i,c):
            if i<len(self.middleware): return self.middleware[i](c,lambda x:run(i+1,x))
            h=self.router.resolve(c.request.method,c.request.path); return h(c) if h else Response(404,{'error':'not_found'})
        return run(0,Context(request))
