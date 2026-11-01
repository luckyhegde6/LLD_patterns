from dataclasses import dataclass,field
from typing import Any
@dataclass(frozen=True)
class Message: id:str; payload:Any; key:str|None=None; headers:dict[str,str]=field(default_factory=dict)
@dataclass
class Partition: messages:list[Message]=field(default_factory=list)
class Broker:
    def __init__(self): self.topics={}; self.offsets={}
    def create_topic(self,name:str,count:int=1):
        if not name or count<1 or name in self.topics: raise ValueError('invalid or duplicate topic')
        self.topics[name]=[Partition() for _ in range(count)]
    def publish(self,topic:str,message:Message)->tuple[int,int]:
        parts=self.topics[topic]; i=hash(message.key or message.id)%len(parts); p=parts[i]; p.messages.append(message); return i,len(p.messages)-1
    def poll(self,topic:str,group:str,partition:int,limit:int=1):
        if limit<1: raise ValueError('limit must be positive')
        start=self.offsets.get((topic,group,partition),0); msgs=self.topics[topic][partition].messages
        return list(enumerate(msgs[start:start+limit],start))
    def commit(self,topic:str,group:str,partition:int,next_offset:int):
        key=(topic,group,partition); cur=self.offsets.get(key,0)
        if not cur<=next_offset<=len(self.topics[topic][partition].messages): raise ValueError('invalid offset')
        self.offsets[key]=next_offset
