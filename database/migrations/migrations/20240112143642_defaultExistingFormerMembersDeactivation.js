/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('membership').where('status', '=', 'Former').update('cancel_reason', 'Dropped out');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('membership').where('status', '=', 'Former').update('cancel_reason', 'Dropped out');
};
