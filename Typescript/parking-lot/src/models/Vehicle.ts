import { VehicleType } from "../enums/VehicleType";

export class Vehicle {
    constructor(
        public readonly id: string,
        public readonly licensePlate: string,
        public readonly type: VehicleType
    ) { }
}
