import { Booking } from "../models/Booking";

export interface BookingRepository {
    save(booking: Booking): void;
    findById(id: string): Booking | undefined;
}
