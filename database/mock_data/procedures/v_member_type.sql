DELIMITER //
CREATE VIEW `v_member_type` AS
    SELECT 
        mt.member_type_id,
        mt.type,
        mt.base_dues_amt
    FROM
        member_types mt
//