/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(
        `update member set subscribed = 'true' where active = 1 and member_type_id in (7,8)`
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(
        `update member set subscribed = 'true' where active = 1 and member_type_id in (7,8)`
    );    
};
