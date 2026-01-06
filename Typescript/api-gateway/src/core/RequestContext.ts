export class RequestContext {
    constructor(
        public readonly requestId: string,
        public readonly userId?: string
    ) { }
}
