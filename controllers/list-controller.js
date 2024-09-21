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
    const listItems = await knex("grocery_list_items as g")
      .leftJoin("cpi_items as c", "g.cpi_item_id", "c.id")
      .where({ "g.grocery_list_id": listId })
      .select(
        "g.id as grocery_list_item_id",
        "g.active_state",
        "g.item_name as grocery_list_item_name",
        "g.category as grocery_list_category",
        "c.market_price",
        "c.unit_of_measure"
      );

    if (listId.length === 0) {
      return res.status(404).json(`List with id ${listId} not found`);
    }

    res.status(200).json(listItems);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Route to update active state for a given grocery list item
const activeState = async (req, res) => {
  const id = req.body.id;
  const active = req.body.active_state;
  try {
    const item = await knex("grocery_list_items")
      .where({ id: id })
      .update({ active_state: active });
    if (item.length === 0) {
      return res.status(404).json(`Item with id: ${id} not found`);
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Route to reset active state for all items on a given grocery list
const resetList = async (req, res) => {
  const groceryId = req.params.groceryListId;
  const active = 1;
  try {
    const itemsAffected = await knex("grocery_list_items")
      .where({ grocery_list_id: groceryId, active_state: 0 })
      .andWhere("id", ">", 0)
      .update({ active_state: active });
    if (itemsAffected === 0) {
      return res.status(404).json(`Grocery list with id: ${id} not found`);
    }
    res.status(200).json({ message: `Updated ${itemsAffected} items` });
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

export { addItemToList, deleteItem, getListItems, activeState, resetList };
