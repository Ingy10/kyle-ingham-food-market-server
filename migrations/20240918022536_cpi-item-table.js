/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("cpi_items", (table) => {
    table.increments("id").primary();
    table.string("item_name").notNullable();
    table.decimal("market_price", 8, 2).notNullable();
    table.string("unit_of_measure").notNullable();
    table.string("category").defaultTo("other");
    table.string("province").notNullable();
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("cpi_items");
}
