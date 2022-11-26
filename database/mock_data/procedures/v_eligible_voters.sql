create or replace view v_eligible_voters as
select 
b.last_name, b.first_name, b.year, m.membership_type, ifnull(mby.attended, 0) meetings_attended, 
ifnull(mby.percent_atttended, 0) percentage_meetings, b.points_earned, 
if (((b.points_earned/b.threshold) >= (1/3)), 'Yes', 'No') eligible_by_points,
if(((mby.percent_atttended) >= 50), 'Yes', 'No') eligible_by_meetings
from 
v_membership m left outer join v_meetings_by_year mby 
on m.membership_id = mby.membership_id 
left outer join v_bill b on m.membership_id = b.membership_id
where b.first_name is not null 
order by b.last_name