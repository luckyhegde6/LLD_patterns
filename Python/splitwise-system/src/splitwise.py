from dataclasses import dataclass
from decimal import Decimal
@dataclass(frozen=True)
class Expense: id:str; payer:str; amount:Decimal; shares:dict[str,Decimal]
class Splitwise:
    def __init__(self): self.expenses={}
    def add(self,e:Expense):
        if e.amount<=0 or sum(e.shares.values(),Decimal('0'))!=e.amount or e.payer not in e.shares: raise ValueError('invalid expense/splits')
        self.expenses.setdefault(e.id,e)
    def balances(self):
        b={}
        for e in self.expenses.values():
            for u,v in e.shares.items(): b[u]=b.get(u,Decimal('0'))-v
            b[e.payer]=b.get(e.payer,Decimal('0'))+e.amount
        return {u:v for u,v in b.items() if v}
    def simplify(self):
        balances=self.balances(); creditors=[[u,v] for u,v in balances.items() if v>0]; debtors=[[u,-v] for u,v in balances.items() if v<0]; out=[]; i=j=0
        while i<len(debtors) and j<len(creditors):
            amt=min(debtors[i][1],creditors[j][1]); out.append((debtors[i][0],creditors[j][0],amt)); debtors[i][1]-=amt; creditors[j][1]-=amt
            if debtors[i][1]==0: i+=1
            if creditors[j][1]==0: j+=1
        return out
