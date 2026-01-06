export class Message {
    constructor(
        public readonly key: string,
        public readonly value: string,
        public readonly timestamp: number = Date.now()
    ) { }
}
