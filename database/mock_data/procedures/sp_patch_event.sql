DELIMITER //
DROP PROCEDURE IF EXISTS `sp_patch_event`;
CREATE PROCEDURE `sp_patch_event`(
IN _event_id INT,
IN _start_date DATETIME,
IN _end_date DATETIME,
IN _event_name VARCHAR(255),
IN _event_description VARCHAR(255)
)
BEGIN
	SELECT start_date, end_date, event_name, event_description, event_type_id
    INTO @cur_start_date, @cur_end_date, @cur_event_name, @cur_event_description, @cur_event_type_id
    FROM event e
    WHERE event_id = _event_id;
	
	SELECT TIMEDIFF(IFNULL(_start_date, @cur_start_date), @cur_start_date) INTO @date_dif;
	
	IF(@date_dif != 0) THEN
			CALL sp_delete_event(_event_id);
			CALL sp_event_job_generation(IFNULL(_start_date, @cur_start_date), IFNULL(_end_date, @cur_end_date), @cur_event_type_id, IFNULL(_event_name, @cur_event_name), IFNULL(_event_description, @cur_event_description));
	END IF;
    
	IF(@date_dif = 0) THEN
		UPDATE event SET
			end_date = IFNULL(_end_date, @cur_end_date),
			event_name = IFNULL(_event_name, @cur_event_name),
			event_description = IFNULL(_event_description, @cur_event_description)
		WHERE event_id = _event_id;
	END IF;
END//