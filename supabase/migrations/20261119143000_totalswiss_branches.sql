-- Total Swiss 據點、會員身分與據點管理員。不改既有報名流程。

create table public.branches (
  id text primary key,
  name text not null,
  short_name text not null,
  county text not null,
  address text not null,
  email text,
  sort_order integer not null,
  hours_note text not null
);

comment on table public.branches is '台灣據點。地址來自官網公開頁，營業時間待公司確認。';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('member', 'organizer', 'admin', 'branch_manager'));

alter table public.profiles
  add column member_type text not null default 'public' check (member_type in ('partner', 'enthusiast', 'public')),
  add column partner_number text,
  add column partner_number_status text not null default 'unverified' check (partner_number_status in ('unverified', 'verified')),
  add column home_branch_id text references public.branches (id),
  add column managed_branch_id text references public.branches (id);

comment on column public.profiles.partner_number is '自我填寫的夥伴或會員編號。預設未驗證，本系統不對接公司名冊。';

alter table public.activities drop constraint if exists activities_kind_check;
alter table public.activities add constraint activities_kind_check
  check (kind in ('exercise', 'talk', 'meetup', 'expo', 'challenge'));

alter table public.activities
  add column branch_id text references public.branches (id),
  add column speaker text;

create index activities_branch_idx on public.activities (branch_id, starts_at);

create or replace function private.can_manage_branch(p_branch text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select private.is_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'branch_manager'
        and managed_branch_id = p_branch
        and p_branch is not null
    );
$$;

create or replace function private.protect_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not private.is_admin() then
    new.role = old.role;
    new.verified = old.verified;
    new.plan_id = old.plan_id;
    new.email = old.email;
    new.id = old.id;
    new.partner_number_status = old.partner_number_status;
    new.managed_branch_id = old.managed_branch_id;
  end if;
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_interests text[] := '{}';
  v_type text := coalesce(new.raw_user_meta_data ->> 'member_type', 'public');
  v_branch text := nullif(new.raw_user_meta_data ->> 'home_branch_id', '');
begin
  if v_type not in ('partner', 'enthusiast', 'public') then
    v_type := 'public';
  end if;
  if v_branch is not null and not exists (select 1 from public.branches where id = v_branch) then
    v_branch := null;
  end if;
  if jsonb_typeof(new.raw_user_meta_data -> 'interests') = 'array' then
    select coalesce(array_agg(value), '{}')
      into v_interests
    from jsonb_array_elements_text(new.raw_user_meta_data -> 'interests') as value;
  end if;

  insert into public.profiles (
    id, email, nickname, phone, city, district, interests, role, plan_id,
    member_type, partner_number, partner_number_status, home_branch_id
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'nickname', ''), split_part(coalesce(new.email, '會員'), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'city', ''), '台北市'),
    coalesce(nullif(new.raw_user_meta_data ->> 'district', ''), '大安區'),
    v_interests,
    'member',
    'free',
    v_type,
    nullif(new.raw_user_meta_data ->> 'partner_number', ''),
    'unverified',
    v_branch
  );
  return new;
end;
$$;

create or replace function private.current_profile()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', id,
    'email', email,
    'nickname', nickname,
    'phone', phone,
    'city', city,
    'district', district,
    'interests', to_jsonb(interests),
    'role', role,
    'verified', verified,
    'plan_id', plan_id,
    'created_at', created_at,
    'member_type', member_type,
    'partner_number', partner_number,
    'partner_number_status', partner_number_status,
    'home_branch_id', home_branch_id,
    'managed_branch_id', managed_branch_id
  )
  from public.profiles
  where id = auth.uid();
$$;

create or replace function private.admin_list_members()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not private.is_admin() then
    raise exception '需要管理員權限';
  end if;
  return (
    select coalesce(jsonb_agg(row_to_json(t)::jsonb order by t.created_at), '[]'::jsonb)
    from (
      select id, email, nickname, phone, city, district, interests, role, verified, plan_id, created_at,
             member_type, partner_number, partner_number_status, home_branch_id, managed_branch_id
      from public.profiles
    ) t
  );
end;
$$;

create or replace function private.admin_list_rsvps(p_activity_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_branch text;
begin
  select branch_id into v_branch from public.activities where id = p_activity_id;
  if not private.can_manage_branch(v_branch) then
    raise exception '需要管理員權限';
  end if;
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', r.id,
      'user_id', r.user_id,
      'nickname', p.nickname,
      'email', p.email,
      'phone', p.phone,
      'status', r.status,
      'safety_declared', r.safety_declared,
      'created_at', r.created_at
    ) order by r.created_at), '[]'::jsonb)
    from public.rsvps r
    join public.profiles p on p.id = r.user_id
    where r.activity_id = p_activity_id
  );
end;
$$;

drop policy if exists activities_select on public.activities;
drop policy if exists activities_insert on public.activities;
drop policy if exists activities_update on public.activities;
drop policy if exists activities_delete on public.activities;

create policy activities_select on public.activities
for select to anon, authenticated
using (status = 'published' or private.can_manage_branch(branch_id));

create policy activities_insert on public.activities
for insert to authenticated
with check (private.can_manage_branch(branch_id));

create policy activities_update on public.activities
for update to authenticated
using (private.can_manage_branch(branch_id))
with check (private.can_manage_branch(branch_id));

create policy activities_delete on public.activities
for delete to authenticated
using (private.can_manage_branch(branch_id));

alter table public.branches enable row level security;
create policy branches_select on public.branches
for select to anon, authenticated
using (true);

grant select on public.branches to anon, authenticated;
grant select (branch_id, speaker) on public.activities to anon, authenticated;
grant select (member_type, partner_number, partner_number_status, home_branch_id, managed_branch_id)
  on public.profiles to anon, authenticated;
grant update (member_type, partner_number, home_branch_id, managed_branch_id, partner_number_status)
  on public.profiles to authenticated;

revoke all on function private.can_manage_branch(text) from public;
grant execute on function private.can_manage_branch(text) to anon, authenticated;
