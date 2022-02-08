DELIMITER //
DROP PROCEDURE IF EXISTS `sp_patch_event_type`;
CREATE PROCEDURE `sp_patch_event_type`(
IN _event_type_id INT,
IN _type VARCHAR(50),
IN _active BIT,
IN _last_modified_by INT,
IN _last_modified_date date
)
BEGIN
SELECT type, active, last_modified_by, last_modified_date
    INTO @type, @active, @last_modified_by, @last_modified_date
    FROM event_type b
    WHERE event_type_id = _event_type_id;
    
    UPDATE event_type SET
		type = IFNULL(_type, @type),
        active = IFNULL(_active, @active),
        last_modified_by = IFNULL(_last_modified_by, @last_modified_by),
        last_modified_date = IFNULL(_last_modified_date, @last_modified_date)
	WHERE event_type_id = _event_type_id;
END//