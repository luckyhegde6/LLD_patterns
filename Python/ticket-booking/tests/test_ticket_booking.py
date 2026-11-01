from src.booking import *

def test_hold_confirm_idempotent():
 b=BookingService({'show':{'A1','A2'}}); h=b.hold('h1','u1','show',['A1'],0,10); assert b.confirm('h1','k',1) is h and b.confirm('h1','k',1) is h
 try: b.hold('h2','u2','show',['A1'],2); assert False
 except ValueError: pass
def test_expired_hold_releases_seat():
 b=BookingService({'s':{'A1'}}); b.hold('h','u','s',['A1'],0,2); assert b.hold('h2','v','s',['A1'],3).token=='h2'
