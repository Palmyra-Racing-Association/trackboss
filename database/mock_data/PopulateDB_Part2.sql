### GEN THE JOBS
CALL sp_event_job_generation('2020-02-01T08:00:00', '2020-02-02T16:00:00', 1, 'The First Race', 'test first race!', @ignore);
CALL sp_event_job_generation('2022-05-15T10:00:00', '2022-05-19T10:00:00', 3, 'XO Race','Test XO Race Job Generation', @ignore);
CALL sp_event_job_generation('2022-02-01T09:00:00', '2022-02-01T15:00:00', 5, 'Yearly Meeting', 'test meeting!', @ignore);
CALL sp_event_job_generation('2022-01-11T08:00:00', '2022-01-13T08:00:00', 6, 'Harescrambler', 'test harescrambler job generation!', @ignore);
CALL sp_event_job_generation('2022-03-15T15:00:00', '2022-03-15T20:00:00', 9, 'Free Ride Day!', 'Test Ride Day!', @ignore);
CALL sp_event_job_generation('2022-01-01T08:00:00', '2022-01-01T16:00:00', 1, '2022 first race', 'test race generation!', @ignore);
###

# Assign members to the jobs
update job set member_id = (job_id % 100 + 1); -- simple way to assign randomly members to jobs ( 101 is how many members we have )

# THIS TO VERIFY 80% of jobs, giving 1-1 points, not verifying paid laborers
update job j
left join job_type jt on j.job_type_id = jt.job_type_id
left join member m on j.member_id = m.member_id
left join member_types mt on m.member_type_id = mt.member_type_id
set verified = 1, verified_date = date_add(j.job_start_date, INTERVAL 14 DAY), points_awarded =  CASE WHEN (j.job_id % 10 < 8) THEN jt.point_value ELSE jt.point_value / 2 END, 
j.last_modified_date = date_add(j.job_start_date, INTERVAL 14 DAY), j.last_modified_by = 1
where ((j.job_id % 10 + 1) > 1) AND mt.type != 'paid laborer';


# Membership - member operations
update member set membership_id = (member_id % 50 + 1); -- simple way to assign to memberships ( 50 is how many memberships we have )
update member set membership_id = null where member_type_id = 4; -- remove memberships from PLs
update member set membership_id = 4 where member_id IN (41, 91); -- this is so we have 4 members on membership_id = 4
update membership set membership_admin_id = 1 where membership_id = 2; -- this will set admin as a membership_admin_id

update member m
left join membership ms on m.membership_id = ms.membership_id
set membership_admin_id = m.member_id
where m.member_type_id = 2;

-- CALL sp_event_job_generation('2022-04-01T08:00:00', '2022-04-01T16:00:00', 1, '2022 Last Race', 'test empty event', @ignore);

