from src.flags import *

def test_target_and_stable():
 s=FlagStore(); s.put(Flag('agent.search',True,100,{'plan':'pro'})); e=Evaluator(s); c=Context('u',{'plan':'pro'})
 assert e.enabled('agent.search',c) and e.enabled('agent.search',c); assert not e.enabled('agent.search',Context('v',{'plan':'free'}))
def test_missing_off(): assert not Evaluator(FlagStore()).enabled('missing',Context('u'))
