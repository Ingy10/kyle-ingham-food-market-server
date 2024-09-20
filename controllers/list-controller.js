import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// route to add new list item
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

// route to delete list item
const deleteItem = async (req, res) => {
  const id = req.body.id;
  const itemName = req.body.item_name;
  try {
    const listItem = await knex("grocery_list_items").where({ id });
    if (listItem.length === 0) {
      return res
        .status(404)
        .json(`Item with ID ${id} and name ${itemName} not found`);
    }
    await knex("grocery_list_items").where({ id }).del();
    res.status(204).end();
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Get all items for a selected list for a given user
const getListItems = async (req, res) => {
  const listId = req.params.groceryListId;
  try {
    const listItems = await knex("grocery_list_items")
      .where({ grocery_list_id: listId })
      .select("*");

    if (listId.length === 0) {
      return res.status(404).json(`List with id ${listId} not found`);
    }

    res.status(200).json(listItems);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

export { addItemToList, deleteItem, getListItems };
