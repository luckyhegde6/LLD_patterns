from src.breaker import *
import pytest

def test_opens_and_recovers():
    now=[0.0]; b=CircuitBreaker(BreakerConfig(2,5),lambda:now[0])
    for _ in range(2):
        with pytest.raises(ValueError): b.call(lambda: (_ for _ in ()).throw(ValueError()))
    assert b.state is State.OPEN
    with pytest.raises(CircuitOpenError): b.call(lambda: 1)
    now[0]=6; assert b.call(lambda: 42)==42; assert b.state is State.CLOSED
