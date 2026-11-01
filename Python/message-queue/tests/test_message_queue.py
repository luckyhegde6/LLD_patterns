from src.queue import *

def test_commit_and_replay():
 b=Broker(); b.create_topic('jobs'); b.publish('jobs',Message('m1',{'kind':'embed'},key='x'))
 assert b.poll('jobs','workers',0)[0][1].id=='m1'; assert b.poll('jobs','workers',0)[0][0]==0
 b.commit('jobs','workers',0,1); assert b.poll('jobs','workers',0)==[]
