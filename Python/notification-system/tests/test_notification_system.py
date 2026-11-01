from src.notifications import *

class FakeChannel:
 name='email'
 def __init__(self): self.sent=[]
 def send(self,to,msg): self.sent.append((to,msg))
def test_idempotent_send():
 c=FakeChannel(); d=Dispatcher([c]); n=Notification('n1','a@b','hello',('email',))
 assert d.dispatch(n)['email'] is Status.SENT; assert d.dispatch(n)['email'] is Status.DUPLICATE; assert len(c.sent)==1
