-- 合作單位申請。公開可新增，只有管理員可讀。

create table public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  phone text not null,
  industry text not null,
  course text not null,
  created_at timestamptz not null default now()
);

alter table public.partner_applications enable row level security;

create policy partner_applications_insert
  on public.partner_applications
  for insert
  to anon, authenticated
  with check (
    char_length(company) between 2 and 80
    and char_length(contact_name) between 1 and 40
    and char_length(phone) between 8 and 20
    and char_length(course) between 10 and 500
  );

create policy partner_applications_admin_select
  on public.partner_applications
  for select
  to authenticated
  using (private.is_admin());

grant insert on public.partner_applications to anon, authenticated;
grant select on public.partner_applications to authenticated;
