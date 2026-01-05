import { Ticket } from "../models/Ticket";

export interface TicketRepository {
    create(ticket: Ticket): void;
    find(ticketId: string): Ticket | undefined;
}
