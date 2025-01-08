/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(
        `update member set is_eligible_dependent = 1 where (birthdate > (NOW() - INTERVAL 18 YEAR)) and dependent_status = 'Child`
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(
        `update member set is_eligible_dependent = 1 where (birthdate > (NOW() - INTERVAL 18 YEAR)) and dependent_status = 'Child`
    );    
};
