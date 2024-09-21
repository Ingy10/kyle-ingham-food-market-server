/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("user_items", (table) => {
    table.increments("id").primary();
    table.integer("cpi_item_id").notNullable();
    table.string("user_item_name").notNullable();
    table.decimal("user_item_price", 8, 2).notNullable();
    table.string("category").defaultTo("other");
    table.string("unit_of_measure").notNullable();
    table.string("province").notNullable();
    table
      .timestamp("date_added")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("user_items");
}
