import { ParkingSpot } from "../models/ParkingSpot";
import { SpotType } from "../enums/SpotType";

export interface SpotRepository {
    findAvailableSpot(type: SpotType): ParkingSpot | undefined;
    markOccupied(spotId: string): void;
    markFree(spotId: string): void;
}
