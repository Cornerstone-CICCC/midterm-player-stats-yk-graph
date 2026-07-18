# Reflection — Player Performance Explorer

## What I built

I built a full-stack app that loads the FIFA World Cup 2026 player data into PostgreSQL and lets a user browse, search, and manage it.

- **Back end:** Express (TypeScript) talking to PostgreSQL through the `pg` library with a connection **Pool**.
- **Front end:** Astro with server-side rendering (Node adapter), styled with bejamas/ui on Tailwind v4.
- **List page:** server-side pagination, a rows-per-page selector (10/25/50/100), search across player name, nationality, position, and team, and sortable columns.
- **Detail page:** shows the full record for one performance.
- **Full CRUD:** create, read, update, and delete, using `GET` / `POST` / `PATCH` / `DELETE`. Form actions call the API with client-side `fetch`.
- **Ranking page:** joins `players` and `performances` and computes `COUNT`, `SUM`, and `AVG` per player with `GROUP BY` (the required JOIN + aggregate).
- **Safe queries:** every value from the user is passed as a `$1` placeholder, never joined into the SQL string. Column names for sorting and updating cannot use placeholders, so I limit them with an allow-list. A value like `?sort=DROP_TABLE` is simply replaced with a safe default.

## How the data is normalized, and why

The flat CSV mixes player info, match info, and stats in every row. The setup script splits it into three tables based on what each fact really depends on:

- **`players`** — one row per player, keyed by `player_id` (primary key). Holds facts about the player that do not change per match: name, age, nationality, team, position, height, weight, foot, club, market value.
- **`matches`** — one row per match, keyed by `match_id` (primary key). Holds facts about the match: date, stadium, city, tournament stage.
- **`performances`** — one row per player **in** a match. Has its own `id`, plus two foreign keys (`player_id → players`, `match_id → matches`) and a `UNIQUE (player_id, match_id)` rule. All per-match stats (minutes, goals, assists, shots, passes, tackles, rating, etc.) live here, because they depend on the _combination_ of a player and a match, not on either one alone.

Why split it this way:

- **No repetition.** In the flat file, a player's name and club repeat on every appearance, and a match's stadium repeats for every player in it. Here each fact is stored once.
- **No update anomalies.** If a player changed club, the flat file would need every one of their rows updated. Here I update one row.
- **Safe links.** The foreign keys make sure a performance can only point to a player and a match that actually exist.

## Challenges and what I'd improve

**Data quality was the biggest surprise.** This is a Kaggle-style, community-made file, and it is not a real tournament:

- Some players appear in dozens of matches, which is impossible for a World Cup (a team plays at most seven).
- The `players` table stores pre-computed totals like `total_goals_tournament`, which are derived data. I built the ranking from the raw `performances` rows instead of trusting those totals.
- When I compared each player's stored `total_goals_tournament` with the sum of their `goals` in `performances`, **828 of 1,248 players (about 66%) did not match.** This is a clear example of why you should not store a derived total next to the rows it comes from — once the two copies disagree, you cannot tell which is right.

**Design choices I made on purpose:**

- I kept the SQL in a `queries/` layer (as constants at the top of each file) so the `routes/` layer only handles HTTP. This keeps the three-table JOIN in one place and will make the `enhance` branch (more normalization) easier to change.
- I used `pg` type parsers to return `NUMERIC` as a number and to keep `DATE` as a plain `YYYY-MM-DD` string (otherwise a timezone shift could move the date by a day).
- I hand-wrote TypeScript types for the query rows, but these are only a promise — they are not checked against the real `SELECT`. A query builder like Kysely or Drizzle would catch that.

**What I'd improve:**

- The create form loads all players into a plain `<select>`. Fine at this size, but at real scale it would need a search-based autocomplete.
- The row types are duplicated between the server and the web package; they should be shared.
- **More normalization.** `nationality` and `club_name` still repeat across many player rows and can drift in spelling (e.g. "Korea Republic" vs "South Korea"), which can split a `GROUP BY`. Moving `countries` and `clubs` into their own tables and linking by foreign key would bring the schema closer to third normal form and let the database enforce one spelling. I explore this in the separate `enhance` branch.
