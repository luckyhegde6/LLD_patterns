import { ParkingManager } from "../src/services/ParkingManager";
import { InMemorySpotRepository } from "../src/repositories/InMemorySpotRepository";
import { InMemoryTicketRepository } from "../src/repositories/InMemoryTicketRepository";
import { HourlyPricingPolicy } from "../src/services/HourlyPricingPolicy";
import { ParkingSpot } from "../src/models/ParkingSpot";
import { SpotType } from "../src/enums/SpotType";
import { Vehicle } from "../src/models/Vehicle";
import { VehicleType } from "../src/enums/VehicleType";

test("Park and unpark vehicle", () => {
    const spots = [new ParkingSpot("S1", SpotType.MEDIUM)];
    const manager = new ParkingManager(
        new InMemorySpotRepository(spots),
        new InMemoryTicketRepository(),
        new HourlyPricingPolicy(50)
    );

    const vehicle = new Vehicle("V1", "KA01AB1234", VehicleType.CAR);
    const ticket = manager.park(vehicle, SpotType.MEDIUM);
    const fee = manager.unpark(ticket.id);

    expect(fee).toBeGreaterThan(0);
});
