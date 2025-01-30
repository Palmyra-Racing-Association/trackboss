exports.up = function (knex) {
    return knex.schema.alterTable('default_settings', function (table) {
      // Rename existing columns
      table.renameColumn('setting_type', 'default_setting_name');
      table.renameColumn('setting_value', 'default_setting_value');
  
      // Add new column without constraints (will be managed at the application level)
      table.string('default_setting_type', 10).notNullable().defaultTo('string');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('default_settings', function (table) {
      // Revert column names
      table.renameColumn('default_setting_type', 'setting_type');
      table.renameColumn('default_setting_value', 'setting_value');
  
      // Drop newly added column
      table.dropColumn('default_setting_type');
    });
  };
  