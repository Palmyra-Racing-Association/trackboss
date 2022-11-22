create view v_events_by_year as
select
year(start) event_year, event_type, count(*) event_count
from 
v_event
where 
start <= now()
group by 
year(start), event_type
