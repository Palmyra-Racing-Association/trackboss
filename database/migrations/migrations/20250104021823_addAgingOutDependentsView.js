/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
        create view v_member_dependent_nostatus as
        select 
            m.last_name AS last_name,
            m.first_name AS first_name,
            m.email AS email,
            m.dependent_status,
            m.membership_admin AS membership_admin,
            (select email from member where member_id = mb.membership_admin_id) admin_email,
            m.birthdate AS birthdate,
            TIMESTAMPDIFF(YEAR, m.birthdate, CURDATE()) AS age
        FROM
            (v_member m join membership mb)
        WHERE
            ((m.birthdate < (NOW() - INTERVAL 18 YEAR)) AND (m.birthdate > (NOW() - INTERVAL 27 YEAR)) AND
            (m.member_type_id NOT IN (7 , 8)) AND
            (m.active = 1) AND
            (mb.status = 'Active') AND
            (mb.membership_id = m.membership_id)) and
            (m.dependent_status is null or m.dependent_status = 'Child')
        ORDER BY m.last_name , m.first_name
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(
        `drop view v_member_dependent_nostatus`
    );
};
