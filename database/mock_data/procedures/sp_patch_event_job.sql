DELIMITER //
DROP PROCEDURE IF EXISTS `sp_patch_event_job`;
CREATE PROCEDURE `sp_patch_event_job`(
    IN _event_job_id INT,
    IN _event_type_id INT,
    IN _job_type_id INT,
    IN _count INT
)
BEGIN
    SELECT event_type_id, job_type_id, count
    INTO @cur_event_type_id, @cur_job_type_id, @cur_count
    FROM event_job ej
    WHERE event_job_id = _event_job_id;
    
    UPDATE event_job SET
		event_type_id = IFNULL(_event_type_id, @cur_event_type_id),
        job_type_id = IFNULL(_job_type_id, @cur_job_type_id),
        count = IFNULL(_count, @cur_count)
	WHERE event_job_id = _event_job_id;
END//