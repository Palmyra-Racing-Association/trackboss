DELIMITER //
CREATE VIEW `v_bill` AS
    SELECT 
        mb.bill_id,
        DATE_FORMAT(mb.generated_date, '%Y-%m-%d') AS generated_date,
        mb.year,
        mb.amount,
        mb.amount_with_fee,
        mb.points_earned,
        mb.threshold,
        CONCAT(ma.first_name, ' ', ma.last_name) AS membership_admin,
        ma.email AS membership_admin_email,
        mb.emailed_bill,
        mb.cur_year_paid,
        mb.membership_id
    FROM
        member_bill mb
            LEFT JOIN
        membership ms ON mb.membership_id = ms.membership_id
            LEFT JOIN
        member ma ON ms.membership_admin_id = ma.member_id;
//
