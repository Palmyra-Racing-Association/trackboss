select id OLD_JOB_ID, title, point_value, cash_value, meal_ticket, sort_order, job_day_number, reserved 
from 
job 
where 
event_type_id = 1 
order by 
job_day_number, sort_order