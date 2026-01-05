import { SpotType } from "../enums/SpotType";

export class ParkingSpot {
    private occupied = false;

    constructor(
        public readonly id: string,
        public readonly type: SpotType
    ) { }

    isAvailable(): boolean {
        return !this.occupied;
    }

    occupy() {
        if (this.occupied) {
            throw new Error("Spot already occupied");
        }
        this.occupied = true;
    }

    free() {
        this.occupied = false;
    }
}
