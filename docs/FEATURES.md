# Features

This document describes behavior present in the current source. The course copy is introductory sample content; several course entries list more lessons than their lesson bodies currently provide.

| Feature | Implementation | Backend dependency |
| --- | --- | --- |
| Home dashboard | `home()` in `index.html`; activity-derived counts and recommended course cards | Local state; Supabase sync is optional |
| Course catalog | `coursesPage()`, `courseCard()`, `updateCourses()`; text search, level select, category tabs | No |
| Course/lesson view | `coursePage()`, `setLesson()`, `completeLesson()`; module text, lesson navigation, completion | Local state; Supabase sync is optional |
| Quiz | `quizPage()`, `submitAnswer()`, `nextQuestion()`; five multiple-choice items, feedback, explanations, score, retry | Local state; scores sync when signed in |
| Glossary | `glossary()`, `updateTerms()`; term search and category filter | No |
| Progress dashboard | `progressPage()`; course completion, lesson count, best quiz, activity history, achievements | Local state; private route when Supabase is configured; sync optional |
| About and safety notes | `about()`; purpose, learning flow, introductory-content disclaimer | No |
| Account | `authPage()`, `submitAuth()`, `signOut()` | Requires configured Supabase Auth |
| Cross-device persistence | `backend.js` and `public.user_progress` | Requires Supabase project, schema, and network |
| Local persistence | `localStorage` key `buildlab-v1` | Browser only; no synchronization |

There is no server-rendered routing, email/password recovery flow, admin panel, course authoring interface, or realtime synchronization in the current code.
