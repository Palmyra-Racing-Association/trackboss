CREATE VIEW `v_work_points_by_membership` AS
    SELECT 
        ms.membership_id AS membership_id,
        YEAR(job_date) AS year,
        SUM(j.points_awarded) AS total_points
    FROM
        job j
            LEFT JOIN
        member m ON j.member_id = m.member_id
            LEFT JOIN
        membership ms ON m.membership_id = ms.membership_id
    GROUP BY ms.membership_id , year;
//