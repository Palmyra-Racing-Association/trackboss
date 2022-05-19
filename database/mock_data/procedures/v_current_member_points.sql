DELIMITER //
create view v_current_member_points as
select 
m.last_name, m.first_name, m.membership_type, ifnull(p.total_points, 0) total_points
from 
v_member m left outer join v_work_points_by_member p
on
p.year = year(now()) and
p.member_id = m.member_id
order by m.last_name, m.first_name
//