# Architecture

## Application shape

BuildLab is a static, single-page browser application implemented without a framework or bundler. The main interface, styles, course catalog, lesson examples, quiz questions, glossary entries, and page rendering live in `index.html`. A global `page` value selects the current view and `render()` replaces the application root with the selected page.

## Main modules

- `index.html`: presentation, responsive navigation, content data, local activity state, search/filter interactions, and the view functions.
- `backend.js`: small wrapper around Supabase Auth REST and PostgREST. It refreshes an expired session token and exposes sign-in, sign-up, sign-out, progress read, and progress upsert operations.
- `supabase-config.js`: local project URL and public client key. This file is ignored by Git. The checked-in template is `supabase-config.example.js`.
- `supabase-schema.sql`: `user_progress` schema, grants, and row-level security policies.

## Authentication flow

When Supabase configuration is present, the account page sends email and password to Supabase Auth. The returned session is stored in browser `localStorage`, then refreshed when an authenticated REST request receives a 401. Sign-out requests Supabase logout and removes the local session. When email confirmation is required, sign-up may return without a session; the UI asks the user to confirm the email and sign in.

The browser route guard requires an authenticated user for the progress page when Supabase is configured. This is a user-experience guard, not the security boundary. Database RLS is the boundary that restricts access to a user's record.

## Data flow

User activity updates the in-memory `data` object and saves it to the `buildlab-v1` local storage key. If a Supabase session exists, saves are debounced and upserted to `public.user_progress`. On sign-in or page initialization, the app reads the user's remote state; when the user has no remote record, the current browser state is uploaded as initial state. After an account has a remote row, that row is loaded as the user's synchronized state.

The remote document is a single JSONB object per user. There is no conflict-resolution protocol beyond the last successful upsert, no realtime subscription, and no offline queue beyond local storage.

## External services and assets

- Supabase Auth and PostgREST are called from the browser when configured.
- Photos are requested from Unsplash's image CDN.
- DM Sans is requested from Google Fonts.

Local-only learning features work without a Supabase connection. External photos and font require network access.

## Security considerations

- Only a publishable/anon key belongs in browser configuration. Never use a service-role key in the frontend.
- RLS policies compare `auth.uid()` with the row's `user_id` and restrict anonymous table access.
- Session data is stored in `localStorage`; an XSS flaw could expose tokens. HTTPS and careful HTML escaping remain important.
- The client directly sends the whole state document. Current size and shape controls are minimal; this is not a hardened production service.
- No Supabase project credentials were present during this audit, so live auth, database permissions, and cross-device behavior could not be verified.
