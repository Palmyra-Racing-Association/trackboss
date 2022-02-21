DELIMITER //
DROP VIEW IF EXISTS `v_event`;
CREATE VIEW `v_event` AS
    SELECT 
        `e`.`event_id` AS `event_id`,
        DATE_FORMAT(`e`.`date`, "%Y-%m-%d") AS `date`,
        `et`.`type` AS `event_type`,
        `e`.`event_name` AS `event_name`,
        `e`.`event_description` AS `event_description`
    FROM
        (`event` `e`
        LEFT JOIN `event_type` `et` ON ((`e`.`event_type_id` = `et`.`event_type_id`)))
//