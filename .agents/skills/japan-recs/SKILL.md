---
name: japan-recs
description: Search the current web for restaurants, food, activities, and places in a specific area of Japan, cross-check the options, and return a concise cited shortlist. Use for 当次联网搜索、日本美食推荐、景点推荐、街区玩法和顺路候选；do not build or retain a personal profile.
---

# Japan Recs

Build a fresh, practical shortlist for the user's current Japan itinerary. Treat every
run as independent research rather than a personal recommendation database.

## Boundaries

- Never request, configure, or depend on a supplier API key.
- Do not create or retain profiles, taste histories, preference databases, or personal
  information. Use only constraints stated in the current request.
- Use the live web or browser available in the current Codex session. Do not require
  Google Sheets, connectors, logins, or a separate knowledge base.
- Research and prepare links only. Never book, pay, log in, or submit personal data.
- Do not spawn subagents unless the user explicitly asks for delegation.

## Research

1. Identify the exact area, visit window, route direction, group size, budget, and food
   restrictions from the current request. Do not invent missing preferences.
2. Search current sources. Prefer official venue pages for hours and reservations,
   Tabelog or Michelin for food-specific evidence, and a recent independent source for
   qualitative recommendations.
3. Cross-check places that materially affect the route. Verify opening days, last order,
   reservation rules, and temporary closures as close to the travel date as practical.
4. Favor a focused shortlist of 5–10 high-confidence choices. Include a useful mix of
   dependable classics, local specialties, and one or two interesting alternatives.
5. Check whether each choice fits the surrounding stops. Flag detours, likely queues,
   cash-only rules, dietary uncertainty, and facts that still need confirmation.

## Output

Return Markdown in chat by default. For each recommendation include:

- Chinese or English name plus Japanese name when available
- category, signature dish or experience, and why it is worth considering
- realistic price band, opening window, reservation need, and source check date
- neighborhood/address and a keyless Google Maps search link or OpenStreetMap link
- how it fits the current route, plus a rain or queue fallback when useful
- direct citations placed next to time-sensitive claims

Write CSV, KML, or a repository research file only when the user asks for a file or when
the active repository's own workflow explicitly needs it. Label uncertainty instead of
guessing, and keep quoted review text short.
