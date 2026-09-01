---
name: jap-tour-sync
description: Keep this repository's Kansai 2026 guide, day-detail pages, and Leaflet map in sync. Use when updating the itinerary, changing a day, adding researched restaurant or attraction recommendations, adjusting map markers/routes, or producing a designed day page for this Japan trip.
---

# Kansai Guide Sync

Maintain the written guide and map as one product. Do not let route copy, coordinates,
and map links drift apart.

## Canonical files

- `app/page.tsx`: trip overview, day summaries, booking cards, restaurants, practical notes, and official links.
- `app/TripMap.tsx`: Leaflet markers, coordinates, categories, and route lines.
- `app/day-*/page.tsx` plus its co-located CSS module: detailed day pages.
- `app/globals.css`: shared guide styling. Keep day-specific scrapbook styling in a CSS module when possible.

## Workflow

1. Read both `app/page.tsx` and `app/TripMap.tsx` before changing a route.
2. For date-sensitive facts, search the current web. Prefer the official operator or venue, then a recent independent source. Add a direct link and label future schedules as an estimate when the exact timetable is not published.
3. Update the overview copy, detailed day page, marker coordinates, and route order together. Coordinates are `[latitude, longitude]`.
4. Map deep links should use ordinary keyless URLs such as `https://www.google.com/maps/search/?api=1&query=...`; never add a Google Maps SDK key.
5. Recommendations are stateless, request-scoped search results. Do not create a personal profile, preference store, recommendation history, or external knowledge base.
6. Never book or submit personal data. Provide official booking or map links for the traveler to open.
7. Run lint/build in proportion to the change. Preview locally. Do not publish with Sites unless the user explicitly asks for hosting.

## Day-page quality bar

- Treat airport arrival as a low-energy half day, include immigration/baggage and a recovery buffer, and keep the first evening walkable and unticketed.
- Show time, place, movement, food cue, fallback, and a clear return/stop time.
- On hand-journal pages, use semantic HTML, readable contrast, reduced-motion support, and real links behind decorative treatments. Decorative generated imagery must contain no fake text.
