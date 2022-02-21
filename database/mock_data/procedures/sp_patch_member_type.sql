DELIMITER //
CREATE PROCEDURE sp_patch_member_type(
    IN _member_type_id INT,
    IN _type VARCHAR(255),
    IN _base_dues_amt FLOAT
)
BEGIN
    SELECT type, base_dues_amt
    INTO @cur_type, @cur_base_dues_amt
    FROM member_types
    WHERE member_type_id = _member_type_id;

UPDATE member_types
SET 
    type = IFNULL(_type, @cur_type),
    base_dues_amt = IFNULL(_base_dues_amt, @cur_base_dues_amt)
WHERE
    member_type_id = _member_type_id;
END// 