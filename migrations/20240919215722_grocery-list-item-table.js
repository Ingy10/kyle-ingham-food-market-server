/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("grocery_list_items", (table) => {
    table.increments("id").primary();
    table.integer("grocery_list_id").notNullable();
    table.integer("cpi_item_id");
    table.integer("user_item_id").notNullable();
    table.boolean("active_state").notNullable();
    table.string("province").notNullable();
    table
      .timestamp("item_added")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("grocery_list_items");
}
