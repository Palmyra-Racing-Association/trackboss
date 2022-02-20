DELIMITER //
CREATE PROCEDURE sp_patch_membership(
    IN _membership_id INT,
    IN _membership_admin_id INT,
    IN _status VARCHAR(255),
    IN _cur_year_renewed BIT,
    IN _renewal_sent BIT,
    IN _year_joined INT,
    IN _address VARCHAR(255),
    IN _city VARCHAR(255),
    IN _state VARCHAR(255),
    IN _zip VARCHAR(255),
    IN _modified_by INT
)
BEGIN
    SELECT membership_admin_id, status, renewal_sent, year_joined, address,
        city, state, zip, cur_year_renewed
    INTO @cur_membership_admin_id, @cur_status, @cur_renewal_sent, @cur_year_joined,
        @cur_address, @cur_city, @cur_state, @cur_zip, @cur_cur_year_renewed
    FROM membership
    WHERE membership_id = _membership_id;

UPDATE membership
SET 
    membership_admin_id = IFNULL(_membership_admin_id, @cur_membership_admin_id),
    status = IFNULL(_status, @cur_status),
    renewal_sent = IFNULL(_renewal_sent, @cur_renewal_sent),
    year_joined = IFNULL(_year_joined, @cur_year_joined),
    address = IFNULL(_address, @cur_address),
    city = IFNULL(_city, @cur_city),
    state = IFNULL(_state, @cur_state),
    zip = IFNULL(_zip, @cur_zip),
    cur_year_renewed = IFNULL(_cur_year_renewed, @cur_cur_year_renewed),
    last_modified_date = CURDATE(),
    last_modified_by = _modified_by
WHERE
    membership_id = _membership_id;
END// 