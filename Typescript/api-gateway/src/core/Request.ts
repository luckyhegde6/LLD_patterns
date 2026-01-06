export class Request {
    constructor(
        public readonly path: string,
        public readonly headers: Record<string, string>,
        public readonly body?: any
    ) { }
}
