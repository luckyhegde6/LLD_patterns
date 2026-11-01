from src.elevator import *

def test_serves_requested_floor():
 e=Elevator(0,8); e.request(3); assert [e.step() for _ in range(3)]==[1,2,3]; assert e.state is State.DOORS_OPEN
def test_bad_floor():
 e=Elevator(0,4)
 try: e.request(8); assert False
 except ValueError: pass
