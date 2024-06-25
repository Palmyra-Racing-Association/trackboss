/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('paid_labor', (table) => {
    // primary key
    table.primary(['paid_labor_id']);
    table.increments('paid_labor_id');
    table.text('last_name');
    table.text('first_name');
    table.text('business_name');
    table.text('phone');
    table.text('email');
    table.timestamps(true, true);
    table.index('paid_labor_id');
  });
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = (knex) => knex.schema.dropTable('paid_labor');
  