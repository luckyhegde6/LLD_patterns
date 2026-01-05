import { ParkingSpot } from "./models/ParkingSpot";
import { SpotType } from "./enums/SpotType";
import { InMemorySpotRepository } from "./repositories/InMemorySpotRepository";
import { InMemoryTicketRepository } from "./repositories/InMemoryTicketRepository";
import { HourlyPricingPolicy } from "./services/HourlyPricingPolicy";
import { ParkingManager } from "./services/ParkingManager";
import { Vehicle } from "./models/Vehicle";
import { VehicleType } from "./enums/VehicleType";

const spots = [
    new ParkingSpot("S1", SpotType.MEDIUM),
    new ParkingSpot("S2", SpotType.MEDIUM),
    new ParkingSpot("S3", SpotType.LARGE)
];

const spotRepo = new InMemorySpotRepository(spots);
const ticketRepo = new InMemoryTicketRepository();
const pricing = new HourlyPricingPolicy(50);

const parkingManager = new ParkingManager(
    spotRepo,
    ticketRepo,
    pricing
);

const car = new Vehicle("V1", "KA01AB1234", VehicleType.CAR);

console.log("🚗 Parking vehicle...");
const ticket = parkingManager.park(car, SpotType.MEDIUM);
console.log("Ticket issued:", ticket);

setTimeout(() => {
    console.log("🚪 Unparking vehicle...");
    const fee = parkingManager.unpark(ticket.id);
    console.log("Parking fee:", fee);
}, 2000);
