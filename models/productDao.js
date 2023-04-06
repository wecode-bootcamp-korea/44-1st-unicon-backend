const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');

const categoryPage = async (mc, sc, pf) => {
  try {
    let condition = '';
    if (sc && filter) {
      condition = `WHERE sub_category.id = ${sc} ORDER BY p.price ${pf}`;
    } else if (sc) {
      condition = `WHERE sub_category.id = ${sc}`;
    } else if (mc & filter) {
      condition = `WHERE main_category.id = ${mc} AND ORDER BY p.price ${pf}`;
    } else if (mc) {
      condition = `WHERE main_category.id = ${mc}`;
    }
    console.log(condition);

    return await appDataSource.query(
      `SELECT
      p.names,
      p.price,
      p.sub_description,
      image.image_url
      FROM product p
      JOIN sub_category
      ON p.sub_category_id = sub_category.id
      JOIN main_category
      ON sub_category.main_category_id = main_category.id
      JOIN  (SELECT product_id, JSON_ARRAYAGG(image_url) AS image_url FROM product_image GROUP BY product_id) AS image
      ON image.product_id = p.id
      ${condition}
  
      ;`
    );
  } catch (err) {
    console.log(err);
    const error = new Error('INVALID_DATA');
    error.statusCode = 400;
    throw error;
  }
};
const getAllproduct = async () => {
  try {
    return await appDataSource.query(
      `SELECT
      p.id,
      p.names,
      p.price,
      p.sub_description,
      JSON_ARRAYAGG(i.image_url) AS image_url
      FROM product p
      JOIN product_image i
      ON p.id = i.product_id
      GROUP BY p.id
      ORDER BY p.price 
      LIMIT 15;
      `
    );
  } catch (err) {
    throw new baseError('INVALID_DATA_INPUT', 500);
  }
};
const getAllproductOrder = async (filter) => {
  try {
    return await appDataSource.query(
      `SELECT
      p.names,
      p.price,
      p.sub_description,
      JSON_ARRAYAGG(i.image_url) AS image_url
      FROM product p
      JOIN product_image i
      ON p.id = i.product_id
      GROUP BY p.id
      ORDER BY p.price ${filter}
      LIMIT 15;
      `
    );
  } catch (err) {
    console.log(err);
    throw new baseError('INVALID_DATA_INPUT', 500);
  }
};

const getProductById = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT 
		  p.names,
      p.descriptions,
      p.sub_description,
      sub_category.title,
      p.price,
      product_size,
      p.is_new,
      JSON_ARRAYAGG(i.image_url) AS image_url
      FROM product_image i
      JOIN product p
      ON p.id = i.product_id
      JOIN sub_category
      ON sub_category.id = p.sub_category_id
      WHERE p.id = ?
      GROUP BY p.id;
	 `,
      [productId]
    );
  } catch (err) {
    console.log(err);
    throw new baseError('INVALID_DATA_INPUT', 500);
  }
};

const getDetailByProductId = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT 
      d.descriptions
      FROM product_detail d
      WHERE d.product_id=?;
	 `,
      [productId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA_INPUT', 500);
  }
};

module.exports = {
  getProductById,
  getDetailByProductId,
  getAllproduct,
  getAllproductOrder,
  categoryPage,
};
