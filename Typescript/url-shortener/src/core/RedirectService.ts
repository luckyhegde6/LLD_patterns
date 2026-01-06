import { UrlRepository } from "../store/UrlRepository";

export class RedirectService {
    constructor(private repo: UrlRepository) { }

    resolve(shortKey: string): string | null {
        const mapping = this.repo.find(shortKey);
        return mapping?.longUrl ?? null;
    }
}
