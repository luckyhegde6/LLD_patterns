import { UrlRepository } from "./UrlRepository";
import { UrlMapping } from "../core/UrlMapping";

export class InMemoryUrlRepository implements UrlRepository {
    private store = new Map<string, UrlMapping>();

    save(mapping: UrlMapping): void {
        this.store.set(mapping.shortKey, mapping);
    }

    find(shortKey: string): UrlMapping | undefined {
        return this.store.get(shortKey);
    }
}
