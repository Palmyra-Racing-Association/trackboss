DELIMITER //
CREATE VIEW `v_work_points_by_member` AS
    SELECT 
        member_id AS member_id,
        YEAR(job_start_date) AS year,
        SUM(points_awarded) AS total_points
    FROM
        job
    GROUP BY member_id, year
//