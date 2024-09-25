/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("user_items").del();
  await knex("user_items").insert([
    {
      cpi_item_id: 1,
      user_item_name: 1,
      user_item_price: 11.8,
      category: "other",
      item_name: "blueberries",
      unit_of_measure: "kg",
      province: "ontario",
    },
  ]);
}
