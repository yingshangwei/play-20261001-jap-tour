# Kansai 2026 trip invariants

These instructions apply to the whole repository. Preserve them when editing the itinerary, map, day pages, restaurant dates, or hosting copy.

## Fixed trip facts

- The travelers arrive at Kansai International Airport on **2026-09-29 at about 14:00**. Do not move the arrival to September 28 and do not invent an extra day.
- The return flight leaves Kansai International Airport on **2026-10-07 at 12:00**. Plan to reach KIX at about 09:00; leave a Namba hotel around 07:45–08:00 or a Shinsaibashi hotel around 07:30.
- The trip is **9 days / 8 nights**, using public transport and walking. The preferred pace is relaxed and nature-leaning: normally no more than 3 meaningful anchors, no more than 2 heavy anchors, and about 8 km walking maximum per day.
- Current lodging rhythm: Osaka Namba/Shinsaibashi **09.29–10.03 (4 nights)**, Kyoto Station area **10.03–10.06 (3 nights)**, Osaka Namba/Shinsaibashi **10.06 (1 night)**.

## Non-negotiable itinerary anchors

- **USJ — 2026-09-30, full day. Never delete or move it without an explicit user request.** Target arrival is 60–90 minutes before the published opening. The booking recommendation must retain a dated Studio Pass and an Express Pass or timed-entry solution covering SUPER NINTENDO WORLD. The 2026 Halloween Horror Nights period includes this date, but exact park hours and attraction schedules must be rechecked on the official USJ site shortly before travel.
- **Kobe — 2026-10-02. Never delete it.** Keep it as an Osaka round trip. The default core is Nunobiki Herb Gardens → Kitano → reserved Kobe-beef lunch → Meriken Park → Harborland. Ikuta Shrine is removed. If the Nunobiki ropeway closes for wind, skip the garden and continue with Kitano and the port; do not delete Kobe.
- **Arashiyama — 2026-10-03. Never delete it.** It is the Osaka-to-Kyoto moving day. Keep the short bamboo-grove visit, Tenryu-ji garden, and Togetsukyo riverfront. Do not add the monkey park or Sagano train by default.
- **Philosopher's Path (哲学之道) — 2026-10-04. Never delete it.** Treat the roughly 2 km canal walk as a 60–75 minute experience, not merely a transfer between temples. The reduced default cluster is Philosopher's Path → Nanzen-ji; Ginkaku-ji and repeat East Kyoto temples are removed.
- **Joyo Autumn Fireworks — 2026-10-04. Never delete or move it.** The fixed event anchor is 19:00 for about 40 minutes at Kizugawa Athletic Park near JR Nagaike. Entry requires an advance ticket and there is no same-day sale. Reach the venue around 16:00 and retain crowd-exit time for a roughly 21:00–21:30 return to the Kyoto hotel.
- **Kifune Shrine (贵船神社) — 2026-10-05. Never delete it, including in rain plans.** The safe default is Eizan Railway to Kibuneguchi plus bus 33, then Main Shrine → Rear Shrine → Yui-no-Yashiro. From May through November the Main Shrine is normally open 06:00–20:00 and the amulet/seal counter 09:00–17:00; recheck official notices. The Kurama-to-Kifune hike is optional only when weather, trail conditions, and energy are all good. It must never replace or endanger the shrine visit.
- **Fushimi Inari Taisha (伏见稻荷大社) — 2026-10-06. Never delete it.** Visit early after Kyoto checkout and before Nara. The default short route is Main Shrine → Senbon Torii → Okusha Hohaisho; do not climb to the summit. Continue south by JR Nara Line so it does not create a cross-city detour.
- **Shinsaibashi — arrival evening on 2026-09-29. Keep it.**
- Nintendo Museum was explicitly removed by the user and must not be reintroduced unless requested.

## Current time skeleton

- **09.29 Osaka arrival:** 14:00 land → about 16:30 hotel → 17:50–21:05 Shinsaibashi, Dotonbori, Hozenji.
- **09.30 USJ:** leave 07:00–07:30, full park day, return after closing.
- **10.01 relaxed Osaka:** 10:30–about 18:30, Kuromon → Shitenno-ji → Keitakuen → Shinsekai → Denden Town; any late stop is droppable.
- **10.02 Kobe round trip:** send large luggage from Osaka to Kyoto before departure; 08:00 leave Osaka → about 09:30–19:00 Nunobiki, Kitano, reserved Kobe-beef lunch, Meriken Park, Harborland → Osaka hotel about 20:00–20:30. Keep an overnight kit for the last Osaka night.
- **10.03 move to Kyoto via Arashiyama:** 07:00 checkout with only a day bag → 08:45–14:00 bamboo grove, Tenryu-ji, Togetsukyo → Kyoto hotel check-in about 15:00–16:00. A formal dinner such as Ryoriya Maekawa may start at 18:30 or later after hotel rest.
- **10.04 Philosopher's Path/Uji/fireworks:** 07:45 departure → about 08:30–11:00 Philosopher's Path and Nanzen-ji → Byodo-in garden/museum and Uji riverside about 12:15–15:15 → venue by 16:00 → fireworks 19:00–19:40 → Kyoto hotel about 21:00–21:30. Skip the Phoenix Hall interior if its queue threatens the event.
- **10.05 Kifune:** 08:00 departure → about 09:45–15:00 Kifune three-shrine visit and river-area lunch → Kyoto hotel about 17:00–18:00.
- **10.06 Fushimi Inari and Nara to Osaka:** forward large luggage to Osaka the previous evening; 06:45 checkout → about 07:15–08:45 Fushimi Inari short route → about 10:15–16:15 Todai-ji, Nigatsu-do, lunch, Kasuga Taisha → Osaka hotel about 18:00–18:30. Kofuku-ji, Naramachi, and Tuesday-closed Isuien are not part of this day.
- **10.07 departure:** leave hotel 07:30–08:00 → KIX about 09:00 → flight 12:00.

## Editing rules

- `app/page.tsx`, `app/TripMap.tsx`, and any detailed day page must describe the same date, stop order, lodging base, and return time.
- When adding a place, state what it replaces. Do not add a stop only because it has a high rating; geography, opening time, walking load, and return-to-hotel safety take priority.
- Moving days require the luggage solution before sightseeing. Japan hotel-to-hotel luggage forwarding is usually next-day; keep an overnight kit and confirm that both hotels accept forwarding.
- Preserve per-date map filtering and keyless Google Maps links. Within an area, use walking directions; cross-region transport should be described separately.
- Exact hotel addresses are not fixed yet. Until they are, hotel-related transit times remain estimates and must not be labeled verified.
- Do not publish or deploy the site unless the user explicitly asks.
