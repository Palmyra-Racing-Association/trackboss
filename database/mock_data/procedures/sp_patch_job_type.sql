DELIMITER //
CREATE PROCEDURE sp_patch_job_type(
    IN _job_type_id INT,
    IN _title VARCHAR(255),
    IN _point_value FLOAT,
    IN _cash_value FLOAT,
    IN _job_day_number INT,
    IN _active BIT,
    IN _reserved BIT,
    IN _online BIT,
    IN _meal_ticket BIT,
    IN _sort_order INT,
    IN _modified_by INT
)
BEGIN
    SELECT title, point_value, cash_value, job_day_number, active, reserved,
        online, meal_ticket, sort_order
    INTO @cur_title, @cur_point_value, @cur_cash_value, @cur_job_day_number,
        @cur_active, @cur_reserved, @cur_online, @cur_meal_ticket,
        @cur_sort_order
    FROM job_type
    WHERE job_type_id = _job_type_id;

UPDATE job_type 
SET 
    title = IFNULL(_title, @cur_title),
    point_value = IFNULL(_point_value, @cur_point_value),
    cash_value = IFNULL(_cash_value, @cur_cash_value),
    job_day_number = IFNULL(_job_day_number, @cur_job_day_number),
    active = IFNULL(_active, @cur_active),
    reserved = IFNULL(_reserved, @cur_reserved),
    online = IFNULL(_online, @cur_online),
    meal_ticket = IFNULL(_meal_ticket, @cur_meal_ticket),
    sort_order = IFNULL(_sort_order, @cur_sort_order),
    last_modified_date = CURDATE(),
    last_modified_by = _modified_by
WHERE
    job_type_id = _job_type_id;
END//