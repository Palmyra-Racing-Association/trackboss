create view v_meetings_by_year as
select 
membership_id, member, year(meeting_date) year, count(*) meetings_attended
from 
v_meeting_attendance
group by membership_id