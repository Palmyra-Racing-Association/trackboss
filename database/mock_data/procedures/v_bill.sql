DELIMITER //
CREATE or replace VIEW `v_bill` AS
    SELECT 
        mb.bill_id,
        DATE_FORMAT(mb.generated_date, '%Y-%m-%d') AS generated_date,
        mb.year,
        round(mb.amount, 2) as amount,
        round(mb.amount_with_fee, 2) as amount_with_fee,
        mb.points_earned,
        mb.threshold,
        ma.last_name,
        ma.first_name,
        CONCAT(ma.first_name, ' ', ma.last_name) AS membership_admin,
        ma.email AS membership_admin_email,
        ma.phone_number,
        mt.type membership_type,
        mb.emailed_bill,
        mb.cur_year_paid,
        mb.cur_year_ins,
        mb.membership_id,
        mb.work_detail
    FROM
        member_bill mb
            LEFT JOIN
        membership ms ON mb.membership_id = ms.membership_id
            LEFT JOIN
        member ma ON ms.membership_admin_id = ma.member_id
			left join 
		membership_types mt on ms.membership_type_id = mt.membership_type_id
	WHERE 
		ms.status = 'active' and ma.active = true
	ORDER BY
		last_name, first_name, year;
//
