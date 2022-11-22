create or replace view v_meetings_by_year
as
select
ma.membership_id, ma.member, m.membership_type, year(ma.meeting_date) meeting_year, count(*) attended, 
ey.event_count, 
round((count(*)/ey.event_count)*100, 2) percent_atttended
from
v_meeting_attendance ma, v_events_by_year ey, v_membership m
where 
year(ma.meeting_date) >= 2022 and 
ey.event_type = 'Meeting' and 
m.membership_id = ma.membership_id
group by ma.membership_id, year(ma.meeting_date)