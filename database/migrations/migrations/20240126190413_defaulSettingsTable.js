/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('default_settings', (table) => {
    // primary key
    table.primary(['default_setting_id']);
    table.increments('default_setting_id');
    table.text('setting_type').notNullable();
    table.text('setting_value').notNullable();
  });
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = (knex) => knex.schema.dropTable('default_settings');
  