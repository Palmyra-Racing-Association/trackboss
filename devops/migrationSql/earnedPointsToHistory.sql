select 
ep.id, ep.date, ep.description, ep.point_value, member_id old_member_id
from 
earned_points ep, member m
where ep.member_id = m.id and ep.paid = 0 and ep.verified = 1 and ep.date < now() order by date desc;