from dataclasses import dataclass
from enum import Enum
from typing import Protocol
class Status(str,Enum): SENT='sent'; FAILED='failed'; DUPLICATE='duplicate'
@dataclass(frozen=True)
class Notification: id:str; recipient:str; message:str; channels:tuple[str,...]
class Channel(Protocol):
    name:str
    def send(self,recipient:str,message:str)->None: ...
class Dispatcher:
    def __init__(self,channels:list[Channel]): self.channels={c.name:c for c in channels}; self.sent=set(); self.dead_letters=[]
    def dispatch(self,n:Notification)->dict[str,Status]:
        out={}
        for name in n.channels:
            key=(n.id,name)
            if key in self.sent: out[name]=Status.DUPLICATE; continue
            ch=self.channels.get(name)
            try:
                if ch is None: raise LookupError('unknown channel')
                ch.send(n.recipient,n.message); self.sent.add(key); out[name]=Status.SENT
            except Exception as e: self.dead_letters.append((n.id,name,type(e).__name__)); out[name]=Status.FAILED
        return out
