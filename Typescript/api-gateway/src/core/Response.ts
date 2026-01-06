export class Response {
    constructor(
        public readonly status: number,
        public readonly body?: any
    ) { }
}
