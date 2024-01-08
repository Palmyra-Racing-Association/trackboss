/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('link', (table) => {
  // primary key
  table.primary(['link_id']);
  table.increments('link_id');
  table.text('link_title').notNullable();
  table.text('link_url').notNullable();
  table.integer('display_order').notNullable();
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('link');
