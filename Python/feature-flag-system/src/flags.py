import hashlib
from dataclasses import dataclass,field
@dataclass(frozen=True)
class Context: user_id:str; attributes:dict[str,str]=field(default_factory=dict)
@dataclass(frozen=True)
class Flag: key:str; enabled:bool; percentage:float=100; rules:dict[str,str]=field(default_factory=dict)
class FlagStore:
    def __init__(self): self.flags={}
    def put(self,flag:Flag):
        if not 0<=flag.percentage<=100: raise ValueError('invalid rollout')
        self.flags[flag.key]=flag
class Evaluator:
    def __init__(self,store:FlagStore): self.store=store
    def enabled(self,key:str,ctx:Context)->bool:
        f=self.store.flags.get(key)
        if not f or not f.enabled or any(ctx.attributes.get(k)!=v for k,v in f.rules.items()): return False
        bucket=int(hashlib.sha256(f'{key}:{ctx.user_id}'.encode()).hexdigest()[:8],16)%10000/100
        return bucket<f.percentage
