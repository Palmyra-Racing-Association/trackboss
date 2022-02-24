DELIMITER //
CREATE PROCEDURE sp_patch_bill(
    IN _bill_id INT,
    IN _emailed_bill DATE,
    IN _cur_year_paid BIT
)
BEGIN
    SELECT emailed_bill, cur_year_paid
    INTO @cur_emailed_bill, @cur_cur_year_paid
    FROM member_bill
    WHERE bill_id = _bill_id;

UPDATE member_bill 
SET 
    emailed_bill = IFNULL(_emailed_bill, @cur_emailed_bill),
    cur_year_paid = IFNULL(_cur_year_paid, @cur_cur_year_paid)
WHERE
    bill_id = _bill_id;
END//