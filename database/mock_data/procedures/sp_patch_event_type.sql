DELIMITER //
DROP PROCEDURE IF EXISTS `sp_patch_event_type`;
CREATE PROCEDURE `sp_patch_event_type`(
IN _event_type_id INT,
IN _type VARCHAR(50),
IN _active BIT,
IN _modified_by INT
)
BEGIN
SELECT type, active, last_modified_by
    INTO @type, @active, @last_modified_by
    FROM event_type b
    WHERE event_type_id = _event_type_id;
    
    UPDATE event_type SET
		type = IFNULL(_type, @type),
        active = IFNULL(_active, @active),
        last_modified_by = _modified_by,
		last_modified_date = CURDATE()
	WHERE event_type_id = _event_type_id;
END//