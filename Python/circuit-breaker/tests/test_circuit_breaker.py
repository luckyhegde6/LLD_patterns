from src.breaker import *

def test_open_and_recover():
 now=[0.0]; b=CircuitBreaker(Config(2,5),lambda:now[0])
 for _ in range(2):
  try: b.call(lambda:(_ for _ in ()).throw(ValueError()))
  except ValueError: pass
 assert b.state is State.OPEN
 try: b.call(lambda:1); assert False
 except CircuitOpenError: pass
 now[0]=6; assert b.call(lambda:42)==42 and b.state is State.CLOSED
