from dataclasses import dataclass
from decimal import Decimal
from enum import Enum
from typing import Protocol
class Status(str,Enum): CREATED='created'; PENDING='pending'; SUCCEEDED='succeeded'; FAILED='failed'
@dataclass
class Intent: id:str; amount:Decimal; currency:str; idempotency_key:str; status:Status=Status.CREATED; provider_ref:str|None=None
class Gateway(Protocol):
    def charge(self,intent:Intent)->str: ...
class PaymentService:
    def __init__(self,gateway:Gateway): self.gateway=gateway; self.by_key={}; self.ledger=[]
    def charge(self,intent_id:str,amount:Decimal,currency:str,key:str)->Intent:
        if amount<=0 or not key: raise ValueError('positive amount and idempotency key required')
        if key in self.by_key: return self.by_key[key]
        p=Intent(intent_id,amount,currency,key); self.by_key[key]=p; p.status=Status.PENDING
        try: p.provider_ref=self.gateway.charge(p)
        except Exception: p.status=Status.FAILED; raise
        return p
    def webhook(self,key:str,provider_ref:str,event:str)->Intent:
        p=self.by_key[key]
        if p.provider_ref and p.provider_ref!=provider_ref: raise ValueError('provider reference mismatch')
        if event=='payment.succeeded' and p.status is not Status.SUCCEEDED:
            p.status=Status.SUCCEEDED; p.provider_ref=provider_ref; self.ledger.append((p.id,'capture',p.amount))
        return p
