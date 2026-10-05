# API Reference

Base URL: `http://localhost:1337`. Read endpoints are public. Responses follow Strapi v5: `{ "data": ..., "meta": { "pagination": {...} } }`, with fields at the top level of each item (no `attributes` wrapper) and a `documentId` for each entry. Only published entries are returned.

## Tours

```bash
curl "http://localhost:1337/api/tours"
curl "http://localhost:1337/api/tours?filters[slug][$eq]=kilimanjaro-machame-7-days&populate=*"
curl "http://localhost:1337/api/tours?filters[featured][$eq]=true&pagination[pageSize]=6"
```

Returns an array in `data`. Fields: `title`, `slug`, `summary`, `description`, `durationDays`, `priceFrom`, `currency`, `difficulty`, `highlights`, `itinerary[]` (`dayNumber`, `title`, `description`, `accommodation`), `destination`, `category`, `seo`. Relations and media need `populate` (a single-tour lookup by slug uses `populate=*`).

## Destinations, categories, testimonials

```bash
curl "http://localhost:1337/api/destinations"
curl "http://localhost:1337/api/categories"
curl "http://localhost:1337/api/testimonials"
```

Standard list responses with Strapi pagination, filters and `populate`. Destinations include optional `latitude` and `longitude` (decimal degrees) for maps.

## Site settings

```bash
curl "http://localhost:1337/api/site-setting?populate=*"
```

Single type: `data` is one object (site name, tagline, contacts, social links, default SEO).

## Search

```bash
curl "http://localhost:1337/api/search?q=kilimanjaro&type=tour&limit=10"
```

Query params: `q` (required), `type` (`tour`, `destination` or `category`, optional), `limit` (optional). Results are ranked (title, then summary, then body) and slim: `type`, `title`, `slug`, `summary`, `cover`. Rate limited.

## Sitemap

```bash
curl "http://localhost:1337/api/sitemap"
```

Returns `slug` and `updatedAt` for tours, destinations and categories, grouped by type.

## Create an enquiry

```bash
curl -X POST "http://localhost:1337/api/enquiries" \
  -H "Content-Type: application/json" \
  -d '{"data":{"name":"Jane Doe","email":"jane@example.com","phone":"+255700000000","message":"Interested in a 7-day trek","travelers":2,"travelDates":"2026-08-15","tour":1,"website":""}}'
```

- Required: `name`, `email`, `message`. Others are optional.
- `website` is a honeypot. Keep it empty; filled requests are rejected as spam.
- `status` and `internalNotes` are ignored on public input; new enquiries start as `new`.
- Enquiries cannot be listed publicly (`GET /api/enquiries` returns 403); manage them in the admin panel.
- Rate limited: too many requests return `429`.

## Errors

Standard Strapi shape: `{ "data": null, "error": { "status": 400, "name": "...", "message": "..." } }`.
