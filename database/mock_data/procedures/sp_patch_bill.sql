DELIMITER //
CREATE PROCEDURE sp_patch_bill(
    IN _bill_id INT,
    IN _amount DOUBLE,
    IN _amount_with_fee DOUBLE,
    IN _emailed_bill DATE,
    IN _cur_year_paid BIT
)
BEGIN
    SELECT amount, amount_with_fee, emailed_bill, cur_year_paid
    INTO @cur_amount, @cur_amount_with_fee, @cur_emailed_bill, @cur_cur_year_paid
    FROM member_bill
    WHERE bill_id = _bill_id;

UPDATE member_bill 
SET 
    amount = IFNULL(_amount, @cur_amount),
    amount_with_fee = IFNULL(_amount_with_fee, @cur_amount_with_fee),
    emailed_bill = IFNULL(_emailed_bill, @cur_emailed_bill),
    cur_year_paid = IFNULL(_cur_year_paid, @cur_cur_year_paid)
WHERE
    bill_id = _bill_id;
END//