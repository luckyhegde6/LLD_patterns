# URL Shortener

## Interview Framing

Design a URL shortener like bit.ly that converts long URLs into short ones and redirects users efficiently.

## Core Requirements
### Functional

- Generate short URLs
- Redirect short URL → original URL
- Support custom aliases (optional)
- Track basic metadata (created time)

### Non-Functional

- Very high read traffic
- Low latency redirects
- Unique short codes
- Horizontally scalable

## Core Responsibilities

| Component        | Responsibility              |
| ---------------- | --------------------------- |
| ShortenerService | Create short URLs           |
| RedirectService  | Resolve short → long        |
| KeyGenerator     | Generate unique short keys  |
| UrlRepository    | Store mappings              |
| Encoder          | Encode numeric IDs (Base62) |


## Key Design Decisions

Write once, read many

ID-based short code generation

Base62 encoding

Cache on read path

Stateless services

## Repo Structure (Final)
```
url-shortener/
├── src/
│   ├── core/
│   │   ├── UrlMapping.ts
│   │   ├── ShortenerService.ts
│   │   └── RedirectService.ts
│   ├── generator/
│   │   ├── KeyGenerator.ts
│   │   └── Base62Encoder.ts
│   ├── store/
│   │   ├── UrlRepository.ts
│   │   └── InMemoryUrlRepository.ts
│   └── index.ts
├── DESIGN.md
├── INTERVIEW.md
├── URL_SHORTENER_EXPLAINED_LIKE_IM_5.md
├── URL_SHORTENER_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json


```

## Trade-offs
