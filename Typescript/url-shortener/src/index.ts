import { ShortenerService } from "./core/ShortenerService";
import { RedirectService } from "./core/RedirectService";
import { InMemoryUrlRepository } from "./store/InMemoryUrlRepository";
import { Base62Encoder } from "./generator/Base62Encoder";

const repo = new InMemoryUrlRepository();
const generator = new Base62Encoder();

const shortener = new ShortenerService(repo, generator);
const redirect = new RedirectService(repo);

const mapping = shortener.shorten("https://example.com/very/long/url");
console.log("Short URL:", mapping.shortKey);
console.log("Redirect to:", redirect.resolve(mapping.shortKey));
