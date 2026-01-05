import { SpotRepository } from "./SpotRepository";
import { ParkingSpot } from "../models/ParkingSpot";
import { SpotType } from "../enums/SpotType";

export class InMemorySpotRepository implements SpotRepository {
    constructor(private spots: ParkingSpot[]) { }

    findAvailableSpot(type: SpotType): ParkingSpot | undefined {
        return this.spots.find(s => s.type === type && s.isAvailable());
    }

    markOccupied(spotId: string): void {
        const spot = this.spots.find(s => s.id === spotId);
        if (!spot) throw new Error("Spot not found");
        spot.occupy();
    }

    markFree(spotId: string): void {
        const spot = this.spots.find(s => s.id === spotId);
        if (!spot) throw new Error("Spot not found");
        spot.free();
    }
}
