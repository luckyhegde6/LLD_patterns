export class Ticket {
    constructor(
        public readonly id: string,
        public readonly vehicleId: string,
        public readonly spotId: string,
        public readonly entryTime: Date,
        public exitTime?: Date
    ) { }
}
