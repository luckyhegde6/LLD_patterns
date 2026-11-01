from src.limiter import *

def test_refill_and_key_scoping():
 now=[0.0]; l=TokenBucket(2,1,lambda:now[0]); assert l.consume('a').allowed and l.consume('a').allowed
 d=l.consume('a'); assert not d.allowed and d.retry_after==1; assert l.consume('b').allowed
 now[0]=1; assert l.consume('a').allowed
