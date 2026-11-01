from dataclasses import dataclass
from threading import Lock
@dataclass
class Hold: token:str; user_id:str; show_id:str; seats:tuple[str,...]; expires_at:float; confirmed:bool=False
class BookingService:
    def __init__(self,inventory:dict[str,set[str]]): self.inventory={k:set(v) for k,v in inventory.items()}; self.holds={}; self.booked={}; self.keys={}; self.lock=Lock()
    def _expire(self,now):
        for k,h in list(self.holds.items()):
            if not h.confirmed and h.expires_at<=now: del self.holds[k]
    def hold(self,token:str,user:str,show:str,seats:list[str],now:float,ttl:float=300):
        if not seats or len(set(seats))!=len(seats) or ttl<=0: raise ValueError('invalid request')
        with self.lock:
            self._expire(now)
            if token in self.holds: return self.holds[token]
            if show not in self.inventory or any(s not in self.inventory[show] for s in seats): raise ValueError('seat unavailable')
            if any((show,s) in self.booked or any(h.show_id==show and s in h.seats for h in self.holds.values()) for s in seats): raise ValueError('seat held/booked')
            h=Hold(token,user,show,tuple(seats),now+ttl); self.holds[token]=h; return h
    def confirm(self,token:str,key:str,now:float):
        with self.lock:
            if key in self.keys: return self.holds[self.keys[key]]
            self._expire(now); h=self.holds[token]
            if h.expires_at<=now: raise ValueError('hold expired')
            for s in h.seats: self.booked[(h.show_id,s)]=h.user_id
            h.confirmed=True; self.keys[key]=token; return h
