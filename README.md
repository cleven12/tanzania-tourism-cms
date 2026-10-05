# Tanzania Tourism CMS: Strapi v5 headless CMS for tour operators

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Strapi v5](https://img.shields.io/badge/Strapi-v5-4945ff.svg)](https://strapi.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6.svg)](https://www.typescriptlang.org)

An open-source, API-first headless CMS built for Tanzanian tour operators: Kilimanjaro treks, safaris, Zanzibar beach stays and day trips. Tanzania-first, and easy to extend to the rest of East Africa.

Companion frontend: [tanzania-tourism-frontend](https://github.com/cleven12/tanzania-tourism-frontend)

## The problem

- **Fragmented tools.** Tours live in a website builder, prices in spreadsheets, enquiries in WhatsApp and email.
- **Tours are structured data, not pages.** Itineraries, inclusions, difficulty and destinations should be queryable fields.
- **Dependence on developers.** Operators should update tours and answer enquiries without calling a developer.
- **Scattered enquiries.** Leads get lost without one place and a status for each.
- **Rebuilt every time.** Every new site starts from zero. This gives you a reusable content backend.

## Features (free MVP)

- Tours with day-by-day itinerary, highlights, inclusions and exclusions
- Destinations and categories (Kilimanjaro, Safari, Zanzibar, Day Trips)
- Testimonials
- Enquiries with status tracking (new, contacted, quoted, won, lost)
- Site settings (contact details, social links, defaults)
- SEO model plus FAQ component for JSON-LD
- Keyword search endpoint
- Sitemap endpoint
- Spam protection: rate limiting, honeypot field, validation

## Tech stack

Strapi v5, TypeScript, Node.js 20+, SQLite by default (PostgreSQL via env).

## Quick start

```bash
git clone https://github.com/cleven12/tanzania-tourism-cms.git && cd tanzania-tourism-cms
npm install
cp .env.example .env   # then set the secrets
npm run seed           # sample tours, destinations, categories
npm run develop        # admin at http://localhost:1337/admin
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tours` | List tours |
| GET | `/api/tours?filters[slug][$eq]=x&populate=*` | One tour by slug, fully populated |
| GET | `/api/destinations` | List destinations |
| GET | `/api/categories` | List categories |
| GET | `/api/testimonials` | List testimonials |
| GET | `/api/site-setting` | Site settings |
| GET | `/api/search?q=` | Keyword search |
| GET | `/api/sitemap` | Slugs and update times for sitemaps |
| POST | `/api/enquiries` | Submit an enquiry |

```bash
curl -X POST http://localhost:1337/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"data":{"name":"Jane","email":"jane@example.com","phone":"+255700000000","message":"Hello","travelers":2,"travelDates":"2026-08","tour":1,"website":""}}'
```

`website` is a honeypot: leave it empty. Full reference in [docs/API.md](docs/API.md).

## Project structure

```
src/
  api/          content types, controllers, routes
  components/   shared components (seo, faq, itinerary)
  index.ts      bootstrap (public permissions)
config/         server, database, middlewares
scripts/        seed script
docs/           API documentation
```

## Roadmap

- [x] Core content types, enquiries, search, sitemap
- [ ] Docker setup
- [ ] More East Africa content (Kenya, Uganda, Rwanda)
- [ ] Webhooks for frontend rebuilds

## Pro version & custom builds

The free version covers content and enquiries. The Pro version adds:

- Online payments and deposits
- Departure dates, availability and pricing seasons
- Multi-language and multi-currency
- Email and WhatsApp notifications
- Semantic / AI search
- Custom design
- Hosting and support

**Need the Pro version or a custom build? Contact: clevengodsontech@gmail.com**

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
