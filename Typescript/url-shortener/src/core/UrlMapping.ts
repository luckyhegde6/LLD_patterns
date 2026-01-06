export class UrlMapping {
    constructor(
        public readonly shortKey: string,
        public readonly longUrl: string,
        public readonly createdAt: Date = new Date()
    ) { }
}
