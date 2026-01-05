import { Booking, BookingStatus } from "../models/Booking";
import { BookingRepository } from "../repositories/BookingRepository";
import { PaymentService } from "./PaymentService";
import { SeatLockManager } from "./SeatLockManager";

export class BookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private paymentService: PaymentService,
    private seatLockManager: SeatLockManager
  ) { }

  createBooking(userId: string, showId: string, seatIds: string[]): Booking {
    const token = this.seatLockManager.holdSeats(showId, seatIds);

    const paymentSuccess = this.paymentService.pay(seatIds.length * 200);
    if (!paymentSuccess) {
      this.seatLockManager.releaseHold(token);
      throw new Error("Payment failed");
    }

    const booking = new Booking(
      crypto.randomUUID(),
      userId,
      showId,
      seatIds,
      BookingStatus.CONFIRMED
    );

    this.bookingRepo.save(booking);
    this.seatLockManager.confirmHold(token);
    return booking;
  }
}
