/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw(
    `insert into paid_labor (last_name, first_name) (
        SELECT 
	    SUBSTRING(member, LOCATE(' ', member) + 1) AS lastName,
        SUBSTRING(member, 1, LOCATE(' ', member) - 1) AS firstName
        FROM 
        v_job
        where member is not null and member_id is null and start > now() and event_type_id = 1
    )`
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw('truncate table paid_labor');
};
