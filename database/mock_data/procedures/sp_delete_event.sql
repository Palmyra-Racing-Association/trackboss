DELIMITER //
DROP PROCEDURE IF EXISTS `sp_delete_event`;
CREATE PROCEDURE `sp_delete_event`(
IN _event_id INT
)
BEGIN
	DELETE FROM job where event_id = _event_id AND verified = 0;
    UPDATE job set event_id = null where event_id = _event_id;
	DELETE FROM event where event_id = _event_id;
END//