exports.up = function (knex) {
  return knex.schema.alterTable('link', (table) => {
    table.boolean('online').defaultTo(true); // Setting default value of 'online' to true
    table.timestamps(true, true); // Adding 'created_at' and 'updated_at' columns
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('link', (table) => {
    table.dropTimestamps(); // Drop 'created_at' and 'updated_at' columns
    table.dropColumn('online'); // Drop 'online' column
  });
};
