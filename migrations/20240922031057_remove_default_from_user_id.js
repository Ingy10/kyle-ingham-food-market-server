/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable("user_items", (table) => {
    table.integer("user_id").notNullable().alter();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable("user_items", (table) => {
    table.integer("user_id").notNullable().defaultTo(1).alter(); // Restore default value if you roll back
  });
}
