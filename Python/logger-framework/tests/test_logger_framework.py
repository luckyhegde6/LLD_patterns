from src.logger import *

def test_filter_flush():
 s=MemorySink(); l=Logger([s],Level.INFO); l.log(Level.DEBUG,'hidden'); l.log(Level.INFO,'agent.tool',tool='lookup')
 assert l.flush()==1 and s.records[0].fields['tool']=='lookup'
def test_bounded_queue():
 l=Logger([],capacity=1); assert l.log(Level.INFO,'a'); assert not l.log(Level.INFO,'b') and l.dropped==1
