import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all CPI items
const getAllProvincialCpiItems = async (req, res) => {
  try {
    const province = req.body.province;

    const itemList = await knex("cpi_items")
      .where({ province: province })
      .select("*");

    if (itemList.length === 0) {
      return res.status(404).json(`No items found for ${province}`);
    }

    res.status(200).json(itemList);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

export { getAllProvincialCpiItems };
