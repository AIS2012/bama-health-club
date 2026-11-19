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
    '{"nickname":"林志工","city":"臺北市","district":"中正區","interests":["講座","健走"],"phone":"02-7711-2012"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated', 'authenticated', 'member@bama.example',
    extensions.crypt('Demo1234!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nickname":"陳阿姨","city":"臺北市","district":"大安區","interests":["健走","瑜珈"]}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated', 'authenticated', 'sample@bama.example',
    extensions.crypt('Demo1234!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nickname":"王伯伯","city":"臺北市","district":"信義區","interests":["太極"]}'::jsonb,
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

insert into public.activities (
  id, title, kind, category, description, starts_at, ends_at, location_name, address,
  city, district, capacity, difficulty, organizer_id, organizer_name, organizer_contact,
  organizer_verified, is_sample, status
) values
(
  'a1000000-0000-4000-8000-000000000001',
  '大安森林公園晨間健走', 'exercise', '健走',
  '【範例活動】在森林公園噴水池集合，沿著園內步道輕鬆走約 60 分鐘。可以聊天，步調由自己決定。這不是訓練課程，也不紀錄心率或步數。',
  now() + interval '2 days' + interval '7 hours 30 minutes',
  now() + interval '2 days' + interval '9 hours',
  '大安森林公園噴水池', '臺北市大安區新生南路二段 1 號',
  '臺北市', '大安區', 25, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-7711-2012（範例電話，請勿撥打）', true, true, 'published'
),
(
  'a1000000-0000-4000-8000-000000000002',
  '板橋公園太極拳', 'exercise', '太極',
  '【範例活動】由志工帶大家做慢速太極暖身，站著或坐著都可以。不強調招式標準，也不宣稱有療效。',
  now() + interval '3 days' + interval '8 hours',
  now() + interval '3 days' + interval '9 hours 15 minutes',
  '板橋 435 藝文特區草坪', '新北市板橋區民生路三段',
  '新北市', '板橋區', 20, 'moderate',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-7711-2012（範例電話，請勿撥打）', true, true, 'published'
),
(
  'a1000000-0000-4000-8000-000000000003',
  '內湖社區瑜珈', 'exercise', '瑜珈',
  '【範例活動】使用椅子輔助的伸展，穿著寬鬆衣服即可。這是同好聚會，不是復健或治療。',
  now() + interval '4 days' + interval '9 hours 30 minutes',
  now() + interval '4 days' + interval '10 hours 30 minutes',
  '內湖運動中心', '臺北市內湖區洲子街 12 號',
  '臺北市', '內湖區', 15, 'moderate',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-7711-2012（範例電話，請勿撥打）', true, true, 'published'
),
(
  'a1000000-0000-4000-8000-000000000004',
  '熟齡防詐與社區健康講座', 'talk', '講座',
  '【範例活動】聊聊常見詐騙話術，以及怎麼跟社區活動安全相處。講師不提供個人理財建議，也不診斷疾病。',
  now() + interval '5 days' + interval '14 hours',
  now() + interval '5 days' + interval '16 hours',
  '紀州庵文學森林', '臺北市中正區同安街 107 號',
  '臺北市', '中正區', 40, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-7711-2012（範例電話，請勿撥打）', true, true, 'published'
),
(
  'a1000000-0000-4000-8000-000000000005',
  '淡水河岸健走', 'exercise', '健走',
  '【範例活動】沿金色水岸平坦步道往返，中途可隨時休息。請自備飲水，天氣不佳會在社團公告改期。',
  now() + interval '6 days' + interval '16 hours',
  now() + interval '6 days' + interval '17 hours 30 minutes',
  '淡水金色水岸', '新北市淡水區中正路一段',
  '新北市', '淡水區', 30, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-7711-2012（範例電話，請勿撥打）', true, true, 'published'
),
(
  'a1000000-0000-4000-8000-000000000006',
  '松山車站暖身健走（範例額滿）', 'exercise', '健走',
  '【範例活動】這場名額刻意設得很小，用來示範額滿後的候補。非正式場次。',
  now() + interval '1 day' + interval '8 hours',
  now() + interval '1 day' + interval '9 hours',
  '松山車站南出口', '臺北市信義區松山路 11 號',
  '臺北市', '信義區', 1, 'easy',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工', '02-7711-2012（範例電話，請勿撥打）', true, true, 'published'
)
on conflict (id) do nothing;

insert into public.groups (id, name, description, interest, city, is_sample, created_by)
values
(
  'b1000000-0000-4000-8000-000000000001',
  '大安健走同好會',
  '【範例社團】住在大安、信義附近，想找人一起散步的朋友。公告只用來約時間，不討論病情。',
  '健走', '臺北市', true,
  (select id from public.profiles where email = 'admin@bama.example')
),
(
  'b1000000-0000-4000-8000-000000000002',
  '板橋太極晨練',
  '【範例社團】新北板橋的慢速太極同好。下雨改室內，會寫在公告。',
  '太極', '新北市', true,
  (select id from public.profiles where email = 'admin@bama.example')
),
(
  'b1000000-0000-4000-8000-000000000003',
  '熟齡講座交流',
  '【範例社團】分享大臺北公開講座與防詐資訊。請不要張貼轉帳帳號或來路不明連結。',
  '講座', null, true,
  (select id from public.profiles where email = 'admin@bama.example')
)
on conflict (id) do nothing;

insert into public.challenges (id, title, description, duration_days, category, is_sample)
values
(
  'c1000000-0000-4000-8000-000000000001',
  '21 天健走挑戰',
  '【範例挑戰】連續 21 天，每天出門走一走或在家原地踏步即可打卡。不計步數、不上傳健檢資料，漏一天也可以繼續。',
  21, '健走', true
),
(
  'c1000000-0000-4000-8000-000000000002',
  '14 天伸展挑戰',
  '【範例挑戰】每天做 10 分鐘自己覺得舒服的伸展。這不是復健處方，疼痛就停下來。',
  14, '伸展', true
)
on conflict (id) do nothing;

insert into public.posts (id, group_id, author_id, author_name, body, status)
values
(
  'd1000000-0000-4000-8000-000000000001',
  'b1000000-0000-4000-8000-000000000001',
  (select id from public.profiles where email = 'admin@bama.example'),
  '林志工',
  '【範例公告】本週健走仍在公園噴水池集合，請穿防滑鞋。若臨時不適，不用勉強到場。',
  'visible'
),
(
  'd1000000-0000-4000-8000-000000000002',
  'b1000000-0000-4000-8000-000000000002',
  (select id from public.profiles where email = 'sample@bama.example'),
  '王伯伯',
  '【範例公告】下雨的話改到活動中心走廊，請不要轉帳給任何自稱代訂場地的人。',
  'visible'
)
on conflict (id) do nothing;

insert into public.rsvps (activity_id, user_id, status, safety_declared)
select 'a1000000-0000-4000-8000-000000000006', id, 'going', true
from public.profiles
where email = 'sample@bama.example'
on conflict (activity_id, user_id) do nothing;
