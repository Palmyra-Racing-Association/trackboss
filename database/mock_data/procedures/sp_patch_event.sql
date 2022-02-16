DELIMITER //
DROP PROCEDURE IF EXISTS `sp_patch_event`;
CREATE PROCEDURE `sp_patch_event`(
IN _event_id INT,
IN _date DATE,
IN _event_name VARCHAR(255),
IN _event_description VARCHAR(255)
)
BEGIN
	SELECT date, event_name, event_description
    INTO @cur_date, @cur_event_name, @cur_event_description
    FROM event e
    WHERE event_id = _event_id;
	
	SELECT DATEDIFF(IFNULL(_date, @cur_date), @cur_date) INTO @date_dif;
    
	UPDATE job SET
		job_date = DATE_ADD(job_date, INTERVAL @date_dif DAY),
        last_modified_date = CURDATE()
	WHERE event_id = _event_id;
    
    UPDATE event SET
		date = IFNULL(_date, @cur_date),
        event_name = IFNULL(_event_name, @cur_event_name),
        event_description = IFNULL(_event_description, @cur_event_description)
	WHERE event_id = _event_id;
END//