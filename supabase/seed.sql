-- Optional demo seed data (mirrors the prototype's sample content).
-- Each block only inserts when its table is still empty, so this is safe
-- to run once after the migration. Skip it entirely for a clean production DB.

-- Trial bookings on the next few days
insert into public.trial_entries (event_date, gakunen, sei, mei, furi_sei, furi_mei, tel, email)
select * from (values
  ((current_date + 1)::date, '小学2年生', '宮城', '翔',   'ミヤギ', 'ショウ', '090-1234-5678', null),
  ((current_date + 2)::date, '小学4年生', '喜納', '美咲', 'キナ',   'ミサキ', null, 'misaki@example.com'),
  ((current_date + 3)::date, '中学1年生', '玉城', '陽葵', 'タマキ', 'ヒマリ', null, 'himari@example.com')
) as v(event_date, gakunen, sei, mei, furi_sei, furi_mei, tel, email)
where not exists (select 1 from public.trial_entries);

-- Enrollments (payment phase deferred; these are applications)
insert into public.enrollments (plan_name, monthly_yen, first_month_yen, card_name)
select * from (values
  ('低学年コース', 6600, 11000, '宮城 太郎'),
  ('アスリート育成コース', 9900, 14300, '下地 一郎')
) as v(plan_name, monthly_yen, first_month_yen, card_name)
where not exists (select 1 from public.enrollments);

-- Coach applications
insert into public.coach_applications (name, age, experience, contact, motivation)
select * from (values
  ('比嘉 健太', '28歳', '学生時代に短距離（100m）', '090-1111-2222', '子どもが好きで、走る楽しさを伝えたいです。'),
  ('金城 美優', '24歳', '未経験／幼児体育の資格あり', 'miyu@example.com', '運動が苦手な子のサポートがしたいです。')
) as v(name, age, experience, contact, motivation)
where not exists (select 1 from public.coach_applications);

-- Sponsor inquiries
insert into public.sponsor_inquiries (company, person, contact, message)
select * from (values
  ('株式会社うみかぜ', '金城 部長', 'info@umikaze.example', 'シルバープランに興味があります。資料をいただけますか。'),
  ('コザ電器', '新垣 様', '098-000-0000', 'ユニフォーム掲出について相談したいです。')
) as v(company, person, contact, message)
where not exists (select 1 from public.sponsor_inquiries);
