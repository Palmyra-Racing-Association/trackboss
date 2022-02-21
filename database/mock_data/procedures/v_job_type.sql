DELIMITER //
CREATE VIEW `v_job_type` AS
    SELECT 
        jt.job_type_id,
        jt.title,
        jt.point_value,
        jt.cash_value,
        jt.job_day_number,
        jt.active,
        jt.reserved,
        jt.online,
        jt.meal_ticket,
        jt.sort_order,
        DATE_FORMAT(jt.last_modified_date, '%Y-%m-%d') AS last_modified_date,
        jt.last_modified_by
    FROM
        job_type jt
//
