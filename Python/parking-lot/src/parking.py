from dataclasses import dataclass
from enum import Enum
from threading import Lock
from decimal import Decimal
class VehicleType(str,Enum): MOTORCYCLE='motorcycle'; CAR='car'; BUS='bus'
@dataclass(frozen=True)
class Vehicle: id:str; kind:VehicleType
@dataclass
class Spot: id:str; level:int; size:int; vehicle_id:str|None=None
@dataclass(frozen=True)
class Ticket: id:str; vehicle_id:str; spot_id:str; entry_time:int
class ParkingLot:
    REQUIRED={VehicleType.MOTORCYCLE:1,VehicleType.CAR:2,VehicleType.BUS:3}
    def __init__(self,spots:list[Spot]): self.spots={s.id:s for s in spots}; self.tickets={}; self.lock=Lock()
    def park(self,v:Vehicle,ticket_id:str,now:int)->Ticket:
        with self.lock:
            if any(t.vehicle_id==v.id for t in self.tickets.values()): raise ValueError('already parked')
            s=next((s for s in sorted(self.spots.values(),key=lambda x:(x.level,x.id)) if s.vehicle_id is None and s.size>=self.REQUIRED[v.kind]),None)
            if s is None: raise RuntimeError('no spot')
            s.vehicle_id=v.id; t=Ticket(ticket_id,v.id,s.id,now); self.tickets[ticket_id]=t; return t
    def unpark(self,ticket_id:str)->Ticket:
        with self.lock:
            t=self.tickets.pop(ticket_id); self.spots[t.spot_id].vehicle_id=None; return t
    def availability(self,kind:VehicleType)->int:
        with self.lock: return sum(s.vehicle_id is None and s.size>=self.REQUIRED[kind] for s in self.spots.values())
def hourly_fee(t:Ticket,exit_time:int,rate:Decimal)->Decimal:
    if exit_time<t.entry_time or rate<0: raise ValueError('invalid duration/rate')
    return rate*max(1,(exit_time-t.entry_time+3599)//3600)
