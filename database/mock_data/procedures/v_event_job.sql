DELIMITER //
DROP VIEW IF EXISTS `v_event_job`;
CREATE VIEW `v_event_job` AS
    SELECT 
        ej.event_job_id,
        et.type AS event_type,
        jt.job_type_id as job_type_id,
        jt.title AS job_type,
        ej.count
    FROM
        event_job ej
            LEFT JOIN
        event_type et ON ej.event_type_id = et.event_type_id
            LEFT JOIN
        job_type jt ON ej.job_type_id = jt.job_type_id
//