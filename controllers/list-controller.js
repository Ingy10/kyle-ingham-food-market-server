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

// Route to add item and price to the user item table
const addUserItem = async (req, res) => {
  if (
    !req.body.user_item_name ||
    !req.body.user_item_price ||
    !req.body.category ||
    !req.body.unit_of_measure ||
    !req.body.province ||
    !req.body.user_id
  ) {
    return res.status(400).json("Please provide all required item information");
  }
  try {
    const updatedItem = await knex("user_items").insert(req.body);
    const newItemId = updatedItem[0];
    const item = await knex("user_items").where({ id: newItemId }).select("*");
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// route to delete list item
const deleteItems = async (req, res) => {
  const id = req.params.groceryListId;
  try {
    const itemCount = await knex("grocery_list_items")
      .where({
        active_state: 0,
        grocery_list_id: id,
      })
      .andWhere("id", ">", 0)
      .count("* as count")
      .first();
    if (itemCount.count === 0) {
      return res.status(404).json(`No items to delete`);
    }
    await knex("grocery_list_items")
      .where({ active_state: 0, grocery_list_id: id })
      .andWhere("id", ">", 0)
      .del();
    res.status(200).json(`${itemCount.count} items deleted`);
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
      .leftJoin("user_items as u", function () {
        this.on("g.item_name", "=", "u.user_item_name").andOn(
          "u.date_added",
          ">=",
          knex.raw("DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 MONTH)")
        );
      })
      .where({ "g.grocery_list_id": listId })
      .groupBy(
        "g.id",
        "g.item_name",
        "c.market_price",
        "u.unit_of_measure",
        "g.active_state",
        "g.cpi_item_id",
        "g.category",
        "c.unit_of_measure"
      )
      .select(
        "g.id as grocery_list_item_id",
        "g.active_state",
        "g.cpi_item_id",
        "g.item_name as grocery_list_item_name",
        "g.category as grocery_list_category",
        "c.market_price",
        "c.unit_of_measure as cpi_unit_of_measure",
        "u.unit_of_measure as user_unit_of_measure",
        knex.raw("AVG(u.user_item_price) as avg_user_price")
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

export {
  addItemToList,
  deleteItems,
  getListItems,
  activeState,
  resetList,
  addUserItem,
};
