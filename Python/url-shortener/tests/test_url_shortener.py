from src.shortener import *

def test_short_and_resolve():
 s=UrlShortener(); u=s.shorten('https://example.com/x'); assert s.resolve(u.rsplit('/',1)[1])=='https://example.com/x'
def test_unsafe_scheme_rejected():
 try: UrlShortener().shorten('javascript:alert(1)'); assert False
 except ValueError: pass
