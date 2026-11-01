from src.snowflake import *

def test_monotonic_unique_ids():
 ticks=iter([1000,1000,1001]); g=SnowflakeGenerator(Config(1000,2),lambda:next(ticks)); ids=[g.next_id() for _ in range(3)]
 assert ids==sorted(ids) and len(set(ids))==3
def test_clock_rollback():
 ticks=iter([1000,999]); g=SnowflakeGenerator(Config(1000,1),lambda:next(ticks)); g.next_id()
 try: g.next_id(); assert False
 except ClockRollback: pass
