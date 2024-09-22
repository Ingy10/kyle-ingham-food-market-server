/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable("user_items", (table) => {
    table.integer("cpi_item_id").nullable().alter();
    table.integer("user_id").notNullable().defaultTo(1);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable("user_items", (table) => {
    table.integer("cpi_item_id").notNullable().alter();
    table.dropColumn("user_id");
  });
}
