# Database

## Provider and setup

The optional persistence provider is Supabase Postgres. The setup is defined in `../supabase-schema.sql`, which must be run in a Supabase project's SQL Editor. There is no migration framework, migration history, seed script, or local database configuration in the repository.

## Table

### `public.user_progress`

| Column | Type | Rules | Purpose |
| --- | --- | --- | --- |
| `user_id` | `uuid` | Primary key; references `auth.users(id)` with cascade delete | Associates one state document with one authenticated account |
| `state` | `jsonb` | Non-null; defaults to an empty object; check requires JSON object | Stores started courses, completed lesson indexes, last lesson indexes, quiz scores, and activity history |
| `updated_at` | `timestamptz` | Non-null; defaults to current time | Last client write timestamp |

There is one row per user and no separate course, lesson, quiz-attempt, or glossary table. Course content is static data in `index.html`, not database content.

## Access control

Row-level security is enabled. Select, insert, and update policies require `auth.uid() = user_id`. Anonymous access is revoked and the `authenticated` role receives select/insert/update table grants. The client upserts using `user_id` as the conflict key.

## Local fallback

Without Supabase configuration, progress is saved to browser `localStorage` under `buildlab-v1`. This is browser-local state, not a backend or multi-user database. Clearing browser site data can remove it.

## Limitations

The JSON document is replaced as a unit during synchronization. Concurrent edits can overwrite each other, there is no event-level history, and server-side validation/size limits are minimal. The repository has not been connected to a live Supabase database during this audit.
