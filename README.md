# BuildLab

BuildLab is a responsive, Portuguese-language learning prototype that introduces construction-civil concepts through short lessons, quizzes, and a searchable glossary. It is designed for beginners and presents educational material rather than professional certification or work authorization.

## Overview

The project brings introductory course content and basic learning tools into one browser application. Learners can browse a small course catalog, read lesson material, review terminology, answer quiz questions, and track activity. The interface uses a dark graphite palette with orange accents and adapts to desktop and mobile screens.

The current implementation is a static client-side application. It can run locally without a backend in local-only mode. Supabase Auth and a Supabase Postgres table are supported when configured; no Supabase project or credentials are included in this repository.

## Features

- Home dashboard with course suggestions and totals calculated from the current browser's saved activity.
- Catalog of eight introductory course entries with search, level selection, and category filters.
- Course lesson view with previous/next navigation, completion tracking, and progress indicators.
- Five-question multiple-choice quiz with answer feedback, explanations, scoring, and retry.
- Searchable construction glossary with category filters.
- Activity history and progress summary.
- Supabase email/password sign-up, sign-in, sign-out, and per-user progress synchronization when configured.
- Local `localStorage` persistence as a fallback when Supabase is not configured.
- Responsive desktop sidebar and mobile navigation.

Course metadata advertises more lessons than the sample lesson bodies currently included. The course library is an educational prototype, not a complete curriculum. Progress counts are based on the course metadata; expand the lesson content and align lesson totals before describing the catalog as complete.

## Screenshots

Screenshots have not been captured yet. Add genuine captures of the running application to `docs/screenshots/` and replace these placeholders:

<!-- Add screenshots captured from the running app; do not use mockups. -->
<!--
![Home dashboard](docs/screenshots/dashboard.png)
![Course catalog](docs/screenshots/courses.png)
![Lesson view](docs/screenshots/lesson.png)
![Quiz](docs/screenshots/quiz.png)
![Glossary](docs/screenshots/glossary.png)
![Learning progress](docs/screenshots/progress.png)
-->

| Screen | File |
| --- | --- |
| Home dashboard | `docs/screenshots/dashboard.png` |
| Course catalog | `docs/screenshots/courses.png` |
| Lesson view | `docs/screenshots/lesson.png` |
| Quiz | `docs/screenshots/quiz.png` |
| Glossary | `docs/screenshots/glossary.png` |
| Learning progress | `docs/screenshots/progress.png` |

See [`docs/screenshots/README.md`](docs/screenshots/README.md) for capture guidance.

## Tech Stack

- HTML5, CSS, and browser JavaScript (no frontend framework or build step).
- Supabase Auth REST endpoints for optional email/password authentication.
- Supabase Postgres REST API for optional progress synchronization.
- Browser `localStorage` for local fallback and session persistence.
- Unsplash-hosted photos and Google Fonts-hosted DM Sans, both loaded from external services.

There is no separate application server, package manager manifest, dependency lockfile, automated test framework, or build/lint configuration in the current project.

## Project Architecture

The application is a static page. `index.html` contains the page markup, styles, course/glossary/quiz content, view rendering, navigation, and UI behavior. `backend.js` is a small browser client for Supabase Auth and the PostgREST endpoint. `supabase-config.js` is a local, ignored configuration file loaded before the backend client. `supabase-schema.sql` defines the database table and row-level security policies.

When configured, the browser sends an email/password to Supabase Auth. Auth tokens are persisted in browser storage. Progress changes are first written to local storage and then debounced to the user's row in Supabase. Row-level security limits reads and writes to the authenticated user's own `user_progress` row. This is a small prototype architecture; it does not provide a custom API server or server-side application validation.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for details.

## Database

The optional database is Supabase Postgres. The current schema has one table, `public.user_progress`, keyed by the Supabase Auth user ID. Course progress, lesson indexes, quiz scores, and activity history are stored together in a JSONB `state` document, with `updated_at` metadata. There are no normalized course or lesson tables, migrations framework, or seed data. Apply `supabase-schema.sql` in the Supabase SQL Editor.

See [`docs/DATABASE.md`](docs/DATABASE.md).

## Getting Started

### Prerequisites

- Python 3, or another static HTTP server.
- A modern browser.
- Optional: a Supabase project for authentication and cross-device synchronization.

### Run locally

1. Clone or download this repository.
2. From the repository root, start a static server:

   ```sh
   python -m http.server 8000
   ```

3. Open `http://127.0.0.1:8000` in a browser.

No dependency installation, build command, or frontend environment variables are required for local-only mode.

### Enable Supabase

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the project's SQL Editor.
3. Copy `supabase-config.example.js` to `supabase-config.js` and enter the project URL and the client-safe publishable (or legacy anon) key.
4. Add the local app URL to the Supabase Auth URL configuration and choose the project's email-confirmation policy.
5. Reload the app and create an account.

The browser-facing publishable/anon key is not a secret; database access is constrained by RLS. Never place a Supabase `service_role` or other secret key in frontend files. Use HTTPS for any hosted deployment. Session tokens are stored in `localStorage`, which means an XSS vulnerability could expose them; the prototype has no server-side session layer.

## Environment Variables

The current code does not read environment variables, so no `.env.example` is needed. Supabase's browser URL and public key are configured in the ignored local `supabase-config.js`; use `supabase-config.example.js` as the template. Do not put secret keys in either file.

## Project Structure

```text
.
├── index.html                    # UI, content, and client-side application logic
├── backend.js                    # Supabase Auth and REST client
├── supabase-config.example.js    # Public configuration template
├── supabase-config.js            # Local configuration; ignored by Git
├── supabase-schema.sql           # Supabase table and RLS setup
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── DATABASE.md
│   └── screenshots/
└── .gitignore
```

## Testing

No automated tests, lint script, or build configuration are present. Basic manual checks can be performed by running the static server and navigating the catalog, lesson view, quiz, glossary, and progress page. Real authentication/database checks require a configured Supabase project.

## Current Status

This is a portfolio prototype that runs locally in local-only mode. Supabase integration is implemented but not connected to a project in this repository. The data model, auth token handling, lesson coverage, and error-state UX should receive additional review before real users rely on it. It has not been deployed or validated against a live Supabase project.

## Future Improvements

- Expand and reconcile lesson content with the displayed lesson counts.
- Add automated unit and browser tests.
- Adopt a maintained Supabase client library or move privileged operations behind a server, if requirements grow.
- Improve session storage, sync conflict handling, offline behavior, and visible sync error states.
- Add server-side schemas or normalized tables if course and activity data need independent querying.
- Add accessibility review and production deployment checks.

## Third-Party Assets

Photos load from Unsplash and the DM Sans font loads from Google Fonts. Unsplash publishes a broad image license, but its terms exclude certain uses and do not grant rights to visible trademarks, identifiable people, or other depicted works; review each selected image and its context before redistributing the project. Attribution is optional under the Unsplash license but appreciated. The current app does not bundle or pin those assets locally. See the [Unsplash License](https://unsplash.com/license). Review the Google Fonts terms and the font's specific license if bundling it.

## License

No license has been selected for this project. Before making the repository public, choose whether and how to license the source code. Common options include MIT (permissive), Apache-2.0 (permissive with express patent terms), and GPL-3.0 (copyleft). This README does not grant a license; the project owner's decision is pending.
