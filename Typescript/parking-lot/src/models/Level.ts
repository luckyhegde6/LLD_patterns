import { ParkingSpot } from "./ParkingSpot";
import { SpotType } from "../enums/SpotType";

export class Level {
    constructor(
        public readonly id: string,
        public readonly levelNumber: number,
        public readonly spots: ParkingSpot[]
    ) { }

    findAvailableSpot(type: SpotType): ParkingSpot | undefined {
        return this.spots.find(s => s.type === type && s.isAvailable());
    }
}
