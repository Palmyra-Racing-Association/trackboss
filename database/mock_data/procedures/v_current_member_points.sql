DELIMITER //
create view v_current_member_points as
select 
m.membership_id, m.last_name, m.first_name, m.phone_number, p.year,
m.membership_type, ifnull(sum(p.total_points), 0) total_points
from 
v_member m left outer join v_work_points_by_member p
on
p.member_id = m.member_id
group by m.membership_id, p.year
order by m.last_name, m.first_name, p.year
//