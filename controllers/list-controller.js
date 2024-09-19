import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const addItemToList = async (req, res) => {
  try {
    if (
      !req.body.grocery_list_id ||
      !req.body.user_item_id ||
      req.body.active_state === null ||
      !req.body.province
    ) {
      return res
        .status(400)
        .json("Please provide all required item information");
    }
    const updatedList = await knex("grocery_list_items").insert(req.body);
    const newItem = updatedList[0];
    console.log(newItem);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};
export { addItemToList };
