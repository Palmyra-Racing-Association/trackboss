DELIMITER //
DROP VIEW IF EXISTS `v_event_type`;
CREATE VIEW `v_event_type` AS
    SELECT 
        et.event_type_id AS event_type_id,
        et.type AS type,
        et.active AS active,
        CONCAT(m.first_name, ' ', m.last_name) AS last_modified_by,
        DATE_FORMAT(et.last_modified_date, "%Y-%m-%d") AS last_modified_date
    FROM
        (event_type et
        LEFT JOIN member m ON (m.member_id = et.last_modified_by))
//