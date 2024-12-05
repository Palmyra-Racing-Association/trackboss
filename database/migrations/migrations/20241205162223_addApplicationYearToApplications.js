exports.up = function (knex) {
    return knex.schema.alterTable('membership_application', (table) => {
      table.integer('application_season').defaultTo(2024); // Setting default value of 'online' to true
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('membership_application', (table) => {
      table.dropColumn('application_season'); // Drop 'online' column
    });
  };
  