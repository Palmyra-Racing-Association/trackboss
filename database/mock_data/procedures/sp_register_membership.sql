DELIMITER //
CREATE PROCEDURE sp_register_membership(
    IN _member_type_id INT,
    IN _first_name VARCHAR(255),
    IN _last_name VARCHAR(255),
    IN _phone_number VARCHAR(255),
    IN _occupation VARCHAR(255),
    IN _email VARCHAR(255),
    IN _birthdate DATE,
    IN _address VARCHAR(255),
    IN _city VARCHAR(255),
    IN _state VARCHAR(255),
    IN _zip VARCHAR(255)
)
BEGIN
    INSERT INTO membership(
        status,
        cur_year_renewed,
        view_online,
        renewal_sent,
        last_modified_date,
        year_joined,
        address,
        city,
        state,
        zip
    ) VALUES (
        'Pending',
        0,
        1,
        0,
        CURDATE(),
        YEAR(CURDATE()),
        _address,
        _city,
        _state,
        _zip
    );

    INSERT INTO member(
        membership_id,
        member_type_id,
        first_name,
        last_name,
        phone_number,
        occupation,
        email,
        birthdate,
        date_joined,
        last_modified_date,
        active
    ) VALUES (
        LAST_INSERT_ID(),
        _member_type_id,
        _first_name,
        _last_name,
        _phone_number,
        _occupation,
        _email,
        _birthdate,
        CURDATE(),
        CURDATE(),
        0
    );
END// 