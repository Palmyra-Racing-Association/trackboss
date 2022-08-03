DELIMITER //
CREATE VIEW `v_work_points_by_member` AS
  select membership_id, year, sum(total_points) total_points from (
    SELECT 
    job.member_id, member.membership_id,
    YEAR(job.job_start_date) AS year,
    SUM(job.points_awarded) AS total_points
    FROM
    job, member
    where paid = 0 and job.member_id = member.member_id
    GROUP BY member_id, year
    union all
    select 
    m.member_id, m.membership_id, year(eph.date) as year, sum(point_value) as total_points
    from
    earned_points_history eph,
    member m
    where 
    m.OLD_MEMBER_ID = eph.old_member_id
    group by member_id, year
  ) tmp group by year, membership_id
//