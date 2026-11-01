from dataclasses import dataclass
from urllib.parse import urlparse
ALPHABET='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
def base62(n:int)->str:
    if n<0: raise ValueError('negative number')
    if n==0: return '0'
    out=''
    while n: n,r=divmod(n,62); out=ALPHABET[r]+out
    return out
@dataclass(frozen=True)
class Mapping: code:str; url:str
class UrlShortener:
    def __init__(self,base_url='https://sho.rt'): self.base_url=base_url.rstrip('/'); self.next_id=1; self.codes={}; self.urls={}
    def shorten(self,url:str,alias:str|None=None)->str:
        p=urlparse(url)
        if p.scheme not in {'http','https'} or not p.netloc: raise ValueError('only absolute http(s) URLs')
        if url in self.urls: return f'{self.base_url}/{self.urls[url]}'
        code=alias or base62(self.next_id)
        if not alias: self.next_id+=1
        if not code or code in self.codes: raise ValueError('code already exists')
        self.codes[code]=Mapping(code,url); self.urls[url]=code; return f'{self.base_url}/{code}'
    def resolve(self,code):
        m=self.codes.get(code); return m.url if m else None
