exports.up = function (knex) {
    return knex.schema.alterTable('event', (table) => {
      table.boolean('restrict_signups').defaultTo(false); // Setting default value of 'online' to true
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('event', (table) => {
      table.dropColumn('restrict_signups'); // Drop 'online' column
    });
  };