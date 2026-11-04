# Screenshot capture checklist

This folder is reserved for genuine screenshots of the running BuildLab app. No screenshots are included yet; do not treat placeholders as images.

From the repository root, run `python -m http.server 8000` and visit `http://127.0.0.1:8000`. Capture the actual browser viewport without editing the UI. Save PNG files here using these names, then embed them in the root README:

- `dashboard.png` — home dashboard, local mode is sufficient.
- `courses.png` — catalog with visible search and filters.
- `lesson.png` — an actual lesson page.
- `quiz.png` — quiz question before submitting an answer.
- `glossary.png` — glossary with its term list and category panel.
- `progress.png` — progress page. This route requires a configured Supabase account; use a clearly identified demo account and non-personal data, or omit this capture until configured.

Do not include email addresses, access tokens, personal browser data, or real user activity in captures. Stop the local server after capture if it is no longer needed.
