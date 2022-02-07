DELIMITER //
DROP PROCEDURE IF EXISTS `sp_patch_bike`;
CREATE PROCEDURE `sp_patch_bike`(
IN _bike_id INT,
IN _year VARCHAR(50),
IN _make VARCHAR(50),
IN _model VARCHAR(50),
IN _membership_id INT
)
BEGIN
	SELECT year, make, model, membership_id
    INTO @cur_year, @cur_make, @cur_model, @cur_membership_id
    FROM member_bikes b
    WHERE bike_id = _bike_id;
    
    UPDATE member_bikes SET
		year = IFNULL(_year, @cur_year),
        make = IFNULL(_make, @cur_make),
        model = IFNULL(_model, @cur_model),
        membership_id = IFNULL(_membership_id, @cur_membership_id)
	WHERE bike_id = _bike_id;
END