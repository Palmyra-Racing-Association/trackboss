DELIMITER //
CREATE VIEW `v_registration` AS
    SELECT 
        m.member_id,
        mt.type as member_type,
        m.first_name,
        m.last_name,
        m.phone_number,
        m.occupation,
        m.email,
        DATE_FORMAT(m.birthdate, '%Y-%m-%d') AS birthdate,
        ms.address,
        ms.city,
        ms.state,
        ms.zip,
    FROM
        member m
            LEFT JOIN
        membership ms ON m.membership_id = ms.membership_id
            LEFT JOIN
        member_types mt ON m.member_type_id = mt.member_type_id
//