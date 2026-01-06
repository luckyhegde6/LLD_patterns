import { UrlRepository } from "../store/UrlRepository";
import { KeyGenerator } from "../generator/KeyGenerator";
import { UrlMapping } from "./UrlMapping";

export class ShortenerService {
    constructor(
        private repo: UrlRepository,
        private generator: KeyGenerator
    ) { }

    shorten(longUrl: string): UrlMapping {
        const key = this.generator.generate();
        const mapping = new UrlMapping(key, longUrl);
        this.repo.save(mapping);
        return mapping;
    }
}
