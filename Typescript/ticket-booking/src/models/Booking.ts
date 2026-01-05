export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

export class Booking {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly showId: string,
        public readonly seatIds: string[],
        public status: BookingStatus
    ) { }
}
