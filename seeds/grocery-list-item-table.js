/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("grocery_list_items").del();
  await knex("grocery_list_items").insert([
    {
      grocery_list_id: 1,
      user_item_id: 1,
      active_state: true,
      province: "Ontario",
    },
  ]);
}
