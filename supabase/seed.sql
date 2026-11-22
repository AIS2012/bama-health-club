-- 範例資料。活動標題與內文都標明「範例」。
-- 示範帳號只供本機或測試專案，正式上線前請刪除，並改掉密碼。
-- 若 auth.users 欄位與目前 Supabase 版本不同，帳號段落會略過，活動仍會寫入。

do $$
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated', 'authenticated', 'admin@bama.example',
    extensions.crypt('Demo1234!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nickname":"林志工","city":"台北市","district":"大安區","interests":["講座","健康料理"],"phone":"02-0000-0000"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated', 'authenticated', 'member@bama.example',
    extensions.crypt('Demo1234!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nickname":"陳阿姨","city":"台北市","district":"大安區","interests":["健康料理","職場伸展"]}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated', 'authenticated', 'sample@bama.example',
    extensions.crypt('Demo1234!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nickname":"王伯伯","city":"台北市","district":"信義區","interests":["職場伸展"]}'::jsonb,
    now(), now(), '', '', '', ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  values
  (
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    '{"sub":"11111111-1111-4111-8111-111111111111","email":"admin@bama.example"}'::jsonb,
    'email', '11111111-1111-4111-8111-111111111111', now(), now(), now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    '{"sub":"22222222-2222-4222-8222-222222222222","email":"member@bama.example"}'::jsonb,
    'email', '22222222-2222-4222-8222-222222222222', now(), now(), now()
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '33333333-3333-4333-8333-333333333333',
    '{"sub":"33333333-3333-4333-8333-333333333333","email":"sample@bama.example"}'::jsonb,
    'email', '33333333-3333-4333-8333-333333333333', now(), now(), now()
  )
  on conflict (id) do nothing;

  update public.profiles
    set role = 'admin', verified = true
  where email = 'admin@bama.example';
  update public.profiles set verified = true where email = 'sample@bama.example';
exception
  when others then
    raise notice '略過示範登入帳號：%', sqlerrm;
end $$;

insert into public.branches (id, name, short_name, county, address, email, sort_order, hours_note)
values
('daan', '大安健康教室', '大安', '台北市', '台北市大安區（範例場地，非正式地址）', 'daan@example.com', 1, '上課時間以各場活動頁為準。地址是示範用的區域說明。'),
('zhongshan', '中山課程空間', '中山', '台北市', '台北市中山區（範例場地，非正式地址）', 'zhongshan@example.com', 2, '上課時間以各場活動頁為準。地址是示範用的區域說明。'),
('xinyi', '信義講座廳', '信義', '台北市', '台北市信義區（範例場地，非正式地址）', 'xinyi@example.com', 3, '上課時間以各場活動頁為準。地址是示範用的區域說明。'),
('songshan', '松山料理教室', '松山', '台北市', '台北市松山區（範例場地，非正式地址）', 'songshan@example.com', 4, '上課時間以各場活動頁為準。地址是示範用的區域說明。'),
('neihu', '內湖手作教室', '內湖', '台北市', '台北市內湖區（範例場地，非正式地址）', 'neihu@example.com', 5, '上課時間以各場活動頁為準。地址是示範用的區域說明。'),
('banqiao', '板橋室內教室', '板橋', '新北市', '新北市板橋區（範例場地，非正式地址）', 'banqiao@example.com', 6, '上課時間以各場活動頁為準。地址是示範用的區域說明。')
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  county = excluded.county,
  address = excluded.address,
  email = excluded.email,
  sort_order = excluded.sort_order,
  hours_note = excluded.hours_note;

insert into public.activities (
  id, title, kind, category, description, starts_at, ends_at, location_name, address,
  city, district, capacity, difficulty, organizer_id, organizer_name, organizer_contact,
  organizer_verified, is_sample, status, branch_id, speaker
) values
(
  'a1000000-0000-4000-8000-000000000001',
  '大安健康料理教室', 'exercise', '健康料理',
  '【範例活動】在室內教室一起備料、組裝一份簡單早餐。可聊天，步調由自己決定。不談食療效果，也不推銷食材。',
  now() + interval '2 days' + interval '10 hours',
  now() + interval '2 days' + interval '11 hours 30 minutes',
  '大安健康教室', '台北市大安區（範例場地）',
  '台北市', '大安區', 16, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-0000-0000（範例電話，請勿撥打）', true, true, 'published', 'daan',
  '示範料理教室（虛構） · 林講師'
),
(
  'a1000000-0000-4000-8000-000000000002',
  '板橋職場伸展與體態', 'exercise', '職場伸展',
  '【範例活動】坐著或站著做肩頸與腰背的一般伸展。這不是復健或治療，疼痛就停下來。',
  now() + interval '3 days' + interval '19 hours',
  now() + interval '3 days' + interval '20 hours',
  '板橋室內教室', '新北市板橋區（範例場地）',
  '新北市', '板橋區', 18, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-0000-0000（範例電話，請勿撥打）', true, true, 'published', 'banqiao',
  '示範健身工作室（虛構） · 陳教練'
),
(
  'a1000000-0000-4000-8000-000000000003',
  '內湖芳療手作', 'meetup', '芳療手作',
  '【範例活動】用手邊材料做一份香味小物。這是手作體驗，不是治療，也不保證舒緩效果。',
  now() + interval '4 days' + interval '14 hours',
  now() + interval '4 days' + interval '15 hours 30 minutes',
  '內湖手作教室', '台北市內湖區（範例場地）',
  '台北市', '內湖區', 12, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-0000-0000（範例電話，請勿撥打）', true, true, 'published', 'neihu',
  '示範手作教室（虛構） · 王老師'
),
(
  'a1000000-0000-4000-8000-000000000004',
  '睡眠與紓壓講座', 'talk', '睡眠與紓壓',
  '【範例活動】聊聊一般的作息與放鬆習慣。不診斷睡眠問題，也不介紹產品效果。',
  now() + interval '5 days' + interval '14 hours',
  now() + interval '5 days' + interval '15 hours 30 minutes',
  '中山課程空間', '台北市中山區（範例場地）',
  '台北市', '中山區', 40, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-0000-0000（範例電話，請勿撥打）', true, true, 'published', 'zhongshan',
  '示範衛教講師（虛構） · 周講師'
),
(
  'a1000000-0000-4000-8000-000000000005',
  '信義飲食營養常識講座', 'talk', '飲食營養',
  '【範例活動】用日常例子談均衡飲食的常識。不是個人營養處方，也不推銷食品。',
  now() + interval '6 days' + interval '15 hours',
  now() + interval '6 days' + interval '16 hours 30 minutes',
  '信義講座廳', '台北市信義區（範例場地）',
  '台北市', '信義區', 36, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-0000-0000（範例電話，請勿撥打）', true, true, 'published', 'xinyi',
  '示範營養諮詢（虛構） · 吳講師'
),
(
  'a1000000-0000-4000-8000-000000000006',
  '松山手機攝影課（範例額滿）', 'exercise', '手機攝影',
  '【範例活動】用自己的手機練習構圖。名額刻意設得很小，用來示範額滿後的候補。非正式場次。',
  now() + interval '1 day' + interval '13 hours 30 minutes',
  now() + interval '1 day' + interval '14 hours 45 minutes',
  '松山料理教室', '台北市松山區（範例場地）',
  '台北市', '松山區', 1, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-0000-0000（範例電話，請勿撥打）', true, true, 'published', 'songshan',
  '示範數位教室（虛構） · 張老師'
)
on conflict (id) do update set
  title = excluded.title,
  kind = excluded.kind,
  category = excluded.category,
  description = excluded.description,
  location_name = excluded.location_name,
  address = excluded.address,
  city = excluded.city,
  district = excluded.district,
  capacity = excluded.capacity,
  branch_id = excluded.branch_id,
  speaker = excluded.speaker;

insert into public.groups (id, name, description, interest, city, is_sample, created_by)
values
(
  'b1000000-0000-4000-8000-000000000001',
  '大安料理同好',
  '【範例社團】住在大安附近，想約人一起上課做菜的朋友。公告只用來約時間。',
  '健康料理', '台北市', true,
  (select id from public.profiles where email = 'admin@bama.example')
),
(
  'b1000000-0000-4000-8000-000000000002',
  '板橋伸展同好',
  '【範例社團】新北板橋的職場伸展同好。改期會寫在公告。這不是復健班。',
  '職場伸展', '新北市', true,
  (select id from public.profiles where email = 'admin@bama.example')
),
(
  'b1000000-0000-4000-8000-000000000003',
  '講座交流',
  '【範例社團】分享公開講座與防詐資訊。請不要張貼轉帳帳號或來路不明連結。',
  '講座', null, true,
  (select id from public.profiles where email = 'admin@bama.example')
)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  interest = excluded.interest,
  city = excluded.city;

insert into public.challenges (id, title, description, duration_days, category, is_sample)
values
(
  'c1000000-0000-4000-8000-000000000001',
  '21 天生活節奏',
  '【範例挑戰】連續 21 天，每天為自己做一件很小的生活安排即可打卡。不計步、不上傳健檢，漏一天也可以繼續。',
  21, '21日挑戰', true
),
(
  'c1000000-0000-4000-8000-000000000002',
  '14 天肩頸放鬆',
  '【範例挑戰】每天做 10 分鐘自己覺得舒服的肩頸活動。這不是復健處方，疼痛就停下來。',
  14, '職場伸展', true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category;

insert into public.posts (id, group_id, author_id, author_name, body, status)
values
(
  'd1000000-0000-4000-8000-000000000001',
  'b1000000-0000-4000-8000-000000000001',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工',
  '【範例公告】本週料理課仍在大安健康教室，請穿方便活動的衣服。若臨時不適，不用勉強到場。',
  'visible'
),
(
  'd1000000-0000-4000-8000-000000000002',
  'b1000000-0000-4000-8000-000000000002',
  (select id from public.profiles where email = 'sample@bama.example'),
  '王伯伯',
  '【範例公告】改期會寫在這裡，請不要轉帳給任何自稱代訂場地的人。',
  'visible'
)
on conflict (id) do update set body = excluded.body;

insert into public.rsvps (activity_id, user_id, status, safety_declared)
select 'a1000000-0000-4000-8000-000000000006', id, 'going', true
from public.profiles
where email = 'sample@bama.example'
on conflict (activity_id, user_id) do nothing;

insert into public.activities (
  id, title, kind, category, description, starts_at, ends_at, location_name, address,
  city, district, capacity, difficulty, organizer_name, organizer_contact,
  organizer_verified, is_sample, status, branch_id, speaker
) values
(
  'a1000000-0000-4000-8000-000000000007',
  '中山數位生活課', 'exercise', '數位生活',
  '【範例活動】練習手機裡常用的設定，例如字級、相簿和防詐提醒。不代辦金融操作。',
  now() + interval '7 days' + interval '10 hours',
  now() + interval '7 days' + interval '11 hours 30 minutes',
  '中山課程空間', '台北市中山區（範例場地）',
  '台北市', '中山區', 20, 'easy',
  '林志工', '02-0000-0000（範例電話，請勿撥打）',
  true, true, 'published', 'zhongshan', '示範數位教室（虛構） · 張老師'
),
(
  'a1000000-0000-4000-8000-000000000008',
  '板橋課程交流', 'meetup', '課程交流',
  '【範例活動】會員互相認識接下來的課程與講座。沒有商品展示，也不做療效說明。',
  now() + interval '8 days' + interval '13 hours 30 minutes',
  now() + interval '8 days' + interval '15 hours',
  '板橋室內教室', '新北市板橋區（範例場地）',
  '新北市', '板橋區', 24, 'easy',
  '林志工', '02-0000-0000（範例電話，請勿撥打）',
  true, true, 'published', 'banqiao', null
),
(
  'a1000000-0000-4000-8000-000000000009',
  '大安 21 日生活節奏說明', 'challenge', '21日挑戰',
  '【範例活動】說明怎麼參加 21 天自己打卡。不紀錄飲食或產品使用，也不上傳健檢。',
  now() + interval '4 days' + interval '15 hours',
  now() + interval '4 days' + interval '16 hours',
  '大安健康教室', '台北市大安區（範例場地）',
  '台北市', '大安區', 25, 'easy',
  '林志工', '02-0000-0000（範例電話，請勿撥打）',
  true, true, 'published', 'daan', null
)
on conflict (id) do update set
  title = excluded.title,
  kind = excluded.kind,
  category = excluded.category,
  description = excluded.description,
  location_name = excluded.location_name,
  address = excluded.address,
  city = excluded.city,
  district = excluded.district,
  branch_id = excluded.branch_id,
  speaker = excluded.speaker;
