from src.parking import *

from decimal import Decimal
def test_park_fee_release():
 lot=ParkingLot([Spot('A1',1,2)]); t=lot.park(Vehicle('v1',VehicleType.CAR),'t1',0)
 assert lot.availability(VehicleType.CAR)==0; assert hourly_fee(t,3601,Decimal('20'))==Decimal('40'); lot.unpark('t1'); assert lot.availability(VehicleType.CAR)==1
