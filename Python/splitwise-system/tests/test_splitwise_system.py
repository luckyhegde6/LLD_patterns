from src.splitwise import *

from decimal import Decimal
def test_ledger_and_simplification():
 s=Splitwise(); s.add(Expense('e','alice',Decimal('90'),{'alice':Decimal('30'),'bob':Decimal('30'),'cara':Decimal('30')}))
 assert s.balances()['alice']==Decimal('60'); assert sum((x[2] for x in s.simplify()),Decimal('0'))==Decimal('60')
