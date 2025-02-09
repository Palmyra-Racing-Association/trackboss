
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('default_settings', (table) => {
        table.string('default_setting_display_name');
    });
};  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('default_settings', (table) => {
        table.dropColumn('default_setting_display_name');
      });  
};
