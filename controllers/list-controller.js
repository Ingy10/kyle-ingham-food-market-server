import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const addItemToList = async (req, res) => {
  try {
    if (
      !req.body.grocery_list_id ||
      !req.body.item_name ||
      req.body.active_state === null ||
      !req.body.province ||
      !req.body.category
    ) {
      return res
        .status(400)
        .json("Please provide all required item information");
    }
    const updatedList = await knex("grocery_list_items").insert(req.body);
    const newItemId = updatedList[0];
    const newItem = await knex("grocery_list_items")
      .where({ id: newItemId })
      .select("*");
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};
export { addItemToList };
