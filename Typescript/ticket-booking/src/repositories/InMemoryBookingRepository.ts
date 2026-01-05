import { BookingRepository } from "./BookingRepository";
import { Booking } from "../models/Booking";

export class InMemoryBookingRepository implements BookingRepository {
  private store = new Map<string, Booking>();

  save(booking: Booking): void {
    this.store.set(booking.id, booking);
  }

  findById(id: string): Booking | undefined {
    return this.store.get(id);
  }
}
