-- Link the staff auth user to the dashboard.
-- Run this AFTER:
--   1) running 0001_init.sql (creates public.staff)
--   2) creating the auth user in Dashboard > Authentication > Add user
--      (email: miyata@staff.miyata-athlete.jp, password: Miyata0305, Auto Confirm)
insert into public.staff (user_id, display_name)
select id, 'Miyata'
from auth.users
where email = 'miyata@staff.miyata-athlete.jp'
on conflict (user_id) do nothing;

-- verify
select s.display_name, u.email
from public.staff s
join auth.users u on u.id = s.user_id;
