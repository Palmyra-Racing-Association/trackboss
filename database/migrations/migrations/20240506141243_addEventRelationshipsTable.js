/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const TABLE_NAME = 'event_type_relationship';
const PK = `${TABLE_NAME}_id`;

exports.up = (knex) => knex.schema.createTable(TABLE_NAME, (table) => {
    // primary key
    table.primary([PK]);
    table.increments(PK);
    table.integer('event_type_id').notNullable();
    table.integer('related_event_type_id').notNullable();
    table.integer('day_difference').notNullable();
    table.string('description');
    table.timestamps(true, true);
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable(TABLE_NAME);
