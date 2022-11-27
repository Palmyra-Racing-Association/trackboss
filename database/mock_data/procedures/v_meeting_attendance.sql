create or replace view v_meeting_attendance as 
select membership_id, member, start meeting_date from v_job 
where event_type_id = 5 and member is not null
union 
select 
eph.membership_id, m.membership_admin, eph.date meeting_date
from
earned_points_history eph left join v_member m on eph.membership_id = m.membership_id and m.member_type in ('Admin', 'Membership Admin')
where 
eph.description = 'Attended Meeting'
order by meeting_date desc