/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('event_type', (table) => {
        table.time('default_start');
        table.time('default_end');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('event_type', (table) => {
        table.dropColumn('default_start');
        table.dropColumn('default_end');
    });
  };
  
