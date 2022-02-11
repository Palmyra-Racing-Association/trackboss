DELIMITER //
CREATE VIEW `v_membership` AS
    SELECT 
        ms.membership_id,
        CONCAT(ma.first_name, ' ', ma.last_name) AS membership_admin,
        ms.status,
        ms.cur_year_renewed,
        ms.renewal_sent,
        ms.year_joined,
        ms.address,
        ms.city,
        ms.state,
        ms.zip,
        DATE_FORMAT(ms.last_modified_date, '%Y-%m-%d') AS last_modified_date,
        CONCAT(lmb.first_name, ' ', lmb.last_name) AS last_modified_by
    FROM
        membership ms
            LEFT JOIN
        member ma ON ms.membership_admin_id = ma.member_id
            LEFT JOIN
        member lmb ON ms.last_modified_by = lmb.member_id
//