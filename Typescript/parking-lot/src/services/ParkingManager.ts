import { SpotRepository } from "../repositories/SpotRepository";
import { TicketRepository } from "../repositories/TicketRepository";
import { PricingPolicy } from "./PricingPolicy";
import { Vehicle } from "../models/Vehicle";
import { Ticket } from "../models/Ticket";
import { SpotType } from "../enums/SpotType";

export class ParkingManager {
    constructor(
        private spotRepo: SpotRepository,
        private ticketRepo: TicketRepository,
        private pricing: PricingPolicy
    ) { }

    park(vehicle: Vehicle, spotType: SpotType): Ticket {
        const spot = this.spotRepo.findAvailableSpot(spotType);
        if (!spot) throw new Error("No available spot");

        this.spotRepo.markOccupied(spot.id);
        const ticket = new Ticket(
            crypto.randomUUID(),
            vehicle.id,
            spot.id,
            new Date()
        );
        this.ticketRepo.create(ticket);
        return ticket;
    }

    unpark(ticketId: string): number {
        const ticket = this.ticketRepo.find(ticketId);
        if (!ticket) throw new Error("Invalid ticket");

        ticket.exitTime = new Date();
        this.spotRepo.markFree(ticket.spotId);
        return this.pricing.calculate(ticket.entryTime, ticket.exitTime);
    }
}
