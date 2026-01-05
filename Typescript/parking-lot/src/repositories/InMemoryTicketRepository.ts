import { TicketRepository } from "./TicketRepository";
import { Ticket } from "../models/Ticket";

export class InMemoryTicketRepository implements TicketRepository {
    private tickets = new Map<string, Ticket>();

    create(ticket: Ticket): void {
        this.tickets.set(ticket.id, ticket);
    }

    find(ticketId: string): Ticket | undefined {
        return this.tickets.get(ticketId);
    }
}
