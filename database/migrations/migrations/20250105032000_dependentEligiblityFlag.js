/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('member', (table) => {
      table.boolean('is_eligible_dependent').defaultTo(false);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.alterTable('member', (table) => {
      table.boolean('is_eligible_dependent').defaultTo(false);
    });
  };
  