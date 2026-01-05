export interface SeatLockManager {
    holdSeats(showId: string, seatIds: string[]): string;
    confirmHold(token: string): void;
    releaseHold(token: string): void;
}
