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
  '【範例社團】分享公開講座與防詐資訊。請不要張貼轉帳帳號或來路不明連結。',
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

insert into public.branches (id, name, short_name, county, address, email, sort_order, hours_note)
values
('taipei', '台北營運中心', '台北', '台北市', '10044 台北市中正區重慶南路一段10號2樓', 'tp@tsmail.com.tw', 1, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('taoyuan', '桃園分公司', '桃園', '桃園市', '330 桃園市桃園區成功路一段37號1樓', 'ty@tsmail.com.tw', 2, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('zhongli', '中壢分公司', '中壢', '桃園市', '桃園市中壢區慈惠三街99號', 'cl@tsmail.com.tw', 3, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('hsinchu', '新竹營運中心', '新竹', '新竹縣', '30251 新竹縣竹北市縣政九路169號2樓', 'hc@tsmail.com.tw', 4, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('miaoli', '苗栗營運中心', '苗栗', '苗栗縣', '36043 苗栗市中山路331號2F', 'ml@tsmail.com.tw', 5, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('taichung', '台中中清營運中心', '台中', '台中市', '404 台中市北區中清路一段581號', 'tc@tsmail.com.tw', 6, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('yuanlin', '員林營運中心', '員林', '彰化縣', '51055 彰化縣員林市中山路二段480號', 'ch@tsmail.com.tw', 7, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('caotun', '草屯營運中心', '草屯', '南投縣', '54263 南投縣草屯鎮太平路二段70號1樓', 'ct@tsmail.com.tw', 8, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('chiayi', '嘉義營運中心', '嘉義', '嘉義市', '60090 嘉義市西區友忠路301號', 'cy@tsmail.com.tw', 9, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('tainan', '台南營運中心', '台南', '台南市', '701 台南市東區崇明路708號1樓', 'tn@tsmail.com.tw', 10, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('kaohsiung', '高雄營運中心', '高雄', '高雄市', '803009 高雄市前金區五福三路21號3樓', 'ks@tsmail.com.tw', 11, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('pingtung', '屏東營運中心', '屏東', '屏東縣', '90011 屏東市公勇路79-2號2樓', 'pd@tsmail.com.tw', 12, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('taitung', '台東營運中心', '台東', '台東縣', '95052 台東縣台東市長安街258號', 'tt@tsmail.com.tw', 13, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('hualien', '花蓮營運中心', '花蓮', '花蓮縣', '97055 花蓮市國聯一路171號1樓', 'hl@tsmail.com.tw', 14, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('yilan', '宜蘭營運中心', '宜蘭', '宜蘭縣', '26041 宜蘭市宜興路一段285號1樓', 'yl@tsmail.com.tw', 15, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。'),
('kinmen', '金門營運中心', '金門', '金門縣', '89347 金門縣金城鎮民族路286號', 'km@tsmail.com.tw', 16, '營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800。')
on conflict (id) do nothing;

update public.activities
set branch_id = 'taipei', city = '台北市'
where id in (
  'a1000000-0000-4000-8000-000000000001',
  'a1000000-0000-4000-8000-000000000003',
  'a1000000-0000-4000-8000-000000000004',
  'a1000000-0000-4000-8000-000000000006'
);

update public.activities
set category = '健康講座', speaker = '志工講師（範例，非產品說明）'
where id = 'a1000000-0000-4000-8000-000000000004';

insert into public.activities (
  id, title, kind, category, description, starts_at, ends_at, location_name, address,
  city, district, capacity, difficulty, organizer_name, organizer_contact,
  organizer_verified, is_sample, status, branch_id, speaker
) values
(
  'a1000000-0000-4000-8000-000000000007',
  '台中據點週會（範例）', 'meetup', '據點聚會',
  '【範例活動】在台中據點碰面，一起走走、交流本週講座時間。不是產品說明會，也不保證任何效果。',
  now() + interval '7 days' + interval '10 hours',
  now() + interval '7 days' + interval '11 hours 30 minutes',
  '台中中清營運中心', '404 台中市北區中清路一段581號',
  '台中市', '北區', 30, 'easy',
  '林志工', '(02)7733-0800（GSC 全球客服中心；範例場次請仍向現場主辦確認）',
  true, true, 'published', 'taichung', null
),
(
  'a1000000-0000-4000-8000-000000000008',
  '高雄健康交流日（範例）', 'expo', '健康交流',
  '【範例活動】朋友一起的交流日，可認識據點與俱樂部活動。沒有療效展示，也不推銷療程。',
  now() + interval '8 days' + interval '13 hours 30 minutes',
  now() + interval '8 days' + interval '16 hours 30 minutes',
  '高雄營運中心', '803009 高雄市前金區五福三路21號3樓',
  '高雄市', '前金區', 80, 'easy',
  '林志工', '(02)7733-0800（GSC 全球客服中心；範例場次請仍向現場主辦確認）',
  true, true, 'published', 'kaohsiung', null
),
(
  'a1000000-0000-4000-8000-000000000009',
  '桃園 21 日一起動起來（範例）', 'challenge', '21日挑戰',
  '【範例活動】說明如何參加 21 天自己打卡的小挑戰。不紀錄飲食或產品使用，也不上傳健檢。',
  now() + interval '4 days' + interval '15 hours',
  now() + interval '4 days' + interval '16 hours',
  '桃園分公司', '330 桃園市桃園區成功路一段37號1樓',
  '桃園市', '桃園區', 25, 'easy',
  '林志工', '(02)7733-0800（GSC 全球客服中心；範例場次請仍向現場主辦確認）',
  true, true, 'published', 'taoyuan', null
)
on conflict (id) do nothing;
