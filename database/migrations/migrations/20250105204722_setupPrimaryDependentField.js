/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(
        `update member set is_eligible_dependent = 1 where dependent_status in ('Primary', 'Spouse/Partner', 'Disabled Adult')`
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(
        `update member set is_eligible_dependent = 1 where dependent_status in ('Primary', 'Spouse/Partner')`
    );    
};
