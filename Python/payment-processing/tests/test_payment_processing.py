from src.payments import *

from decimal import Decimal
class FakeGateway:
 def charge(self,intent): return 'provider-1'
def test_idempotency_and_webhook():
 s=PaymentService(FakeGateway()); p=s.charge('p1',Decimal('10'),'INR','key'); assert s.charge('p2',Decimal('10'),'INR','key') is p
 s.webhook('key','provider-1','payment.succeeded'); s.webhook('key','provider-1','payment.succeeded'); assert p.status is Status.SUCCEEDED and len(s.ledger)==1
