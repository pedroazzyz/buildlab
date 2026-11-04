-- Execute no SQL Editor do Supabase para criar a tabela de progresso.
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

drop policy if exists "Users read own progress" on public.user_progress;
create policy "Users read own progress" on public.user_progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own progress" on public.user_progress;
create policy "Users insert own progress" on public.user_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own progress" on public.user_progress;
create policy "Users update own progress" on public.user_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.user_progress from anon;
grant select, insert, update on public.user_progress to authenticated;

-- Restrict progress documents to JSON objects.
alter table public.user_progress drop constraint if exists user_progress_state_object;
alter table public.user_progress add constraint user_progress_state_object check (jsonb_typeof(state) = 'object');
