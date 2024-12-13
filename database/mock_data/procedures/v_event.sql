DELIMITER //
DROP VIEW IF EXISTS `v_event`;
CREATE VIEW `v_event` AS
    SELECT 
        `e`.`event_id` AS `event_id`,
        et.event_type_id,
        DATE_FORMAT(`e`.`start_date`, "%Y-%m-%d %H:%i:%s") AS `start`,
        DATE_FORMAT(`e`.`end_date`, "%Y-%m-%d %H:%i:%s") AS `end`,
        `et`.`type` AS `event_type`,
        `e`.`event_name` AS `title`,
        `e`.`event_description` AS `event_description`,
        `e`.`restrict_signups` as `restrict_signups`
    FROM
        (`event` `e`
        LEFT JOIN `event_type` `et` ON ((`e`.`event_type_id` = `et`.`event_type_id`)))
//