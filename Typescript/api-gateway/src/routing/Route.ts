export class Route {
    constructor(
        public readonly pathPrefix: string,
        public readonly serviceName: string
    ) { }
}
