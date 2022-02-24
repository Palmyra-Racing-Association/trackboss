DELIMITER //
DROP VIEW IF EXISTS `v_job`;
CREATE VIEW `v_job` AS
    SELECT
		j.job_id,
		CONCAT(m.first_name, ' ', m.last_name) AS member,
		m.member_id,
		m.membership_id,
		e.event_name as event,
		e.event_id,
		j.job_date,
		jt.title as job_type,
		j.verified,
		DATE_FORMAT(j.verified_date, '%Y-%m-%d') AS verified_date,
		j.points_awarded,
		j.paid,
		DATE_FORMAT(j.paid_date, '%Y-%m-%d') AS paid_date,
		DATE_FORMAT(j.last_modified_date, '%Y-%m-%d') AS last_modified_date,
		CONCAT(m2.first_name, ' ', m2.last_name) AS last_modified_by
    FROM
        job j
            LEFT JOIN
        member m ON m.member_id = j.member_id
			LEFT JOIN
		member m2 ON m2.member_id = j.last_modified_by
            LEFT JOIN
        event e ON e.event_id = j.event_id
            LEFT JOIN
        job_type jt ON j.job_type_id = jt.job_type_id;
//