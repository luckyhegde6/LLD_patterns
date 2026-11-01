import { ParkingManager } from "../src/services/ParkingManager";
import { InMemorySpotRepository } from "../src/repositories/InMemorySpotRepository";
import { InMemoryTicketRepository } from "../src/repositories/InMemoryTicketRepository";
import { HourlyPricingPolicy } from "../src/services/HourlyPricingPolicy";
import { ParkingSpot } from "../src/models/ParkingSpot";
import { SpotType } from "../src/enums/SpotType";
import { Vehicle } from "../src/models/Vehicle";
import { VehicleType } from "../src/enums/VehicleType";

test("Park and unpark vehicle charges at least one hour", () => {
    const spots = [new ParkingSpot("S1", SpotType.MEDIUM)];
    let currentTime = new Date("2026-01-01T10:00:00.000Z");

    const manager = new ParkingManager(
        new InMemorySpotRepository(spots),
        new InMemoryTicketRepository(),
        new HourlyPricingPolicy(50),
        () => new Date(currentTime)
    );

    const vehicle = new Vehicle("V1", "KA01AB1234", VehicleType.CAR);
    const ticket = manager.park(vehicle, SpotType.MEDIUM);

    // A positive duration below one hour rounds up to one billable hour.
    currentTime = new Date("2026-01-01T10:00:01.000Z");
    const fee = manager.unpark(ticket.id);

    expect(fee).toBe(50);
});
