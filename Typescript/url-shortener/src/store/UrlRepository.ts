import { UrlMapping } from "../core/UrlMapping";

export interface UrlRepository {
    save(mapping: UrlMapping): void;
    find(shortKey: string): UrlMapping | undefined;
}
