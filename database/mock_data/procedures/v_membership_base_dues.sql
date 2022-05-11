DELIMITER //
CREATE VIEW `v_membership_base_dues` AS
    SELECT
        m.membership_id AS membership_id,
        MIN(mt.base_dues_amt) AS base_dues_amt
    FROM
        member m
            LEFT JOIN
        membership ms ON m.membership_id = ms.membership_id
            LEFT JOIN
        membership_types mt ON ms.membership_type_id = mt.membership_type_id
    GROUP BY
        membership_id
//