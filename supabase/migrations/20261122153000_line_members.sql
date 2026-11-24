-- LINE 會員。一般會員不以電子信箱為必填。

alter table public.profiles
  add column line_user_id text unique,
  add column line_consent_at timestamptz;

comment on column public.profiles.line_user_id is 'LINE Login 的使用者識別碼（sub）。不是顯示名稱。';
comment on column public.profiles.line_consent_at is '會員同意使用 LINE 顯示名稱加入的時間。空的表示還沒完成加入步驟。';

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
    'managed_branch_id', managed_branch_id,
    'line_user_id', line_user_id,
    'line_consent_at', line_consent_at
  )
  from public.profiles
  where id = auth.uid();
$$;

grant select (line_user_id, line_consent_at) on public.profiles to authenticated;
grant update (line_consent_at) on public.profiles to authenticated;
