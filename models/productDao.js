const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');

const categoryPage = async (mc, sc, pf) => {
  try {
    let condition = '';
    if (sc) {
      condition = `WHERE sub_category.id = ${sc}`;
    }

    if (mc) {
      condition = `WHERE main_category.id = ${mc}`;
    }
    if (pf) {
      condition = `WHERE ORDER BY p.price ${pf}`;
    }

    if (mc & pf) {
      condition = `WHERE main_category.id = ${mc} AND ORDER BY p.price ${pf}`;
    }

    if (sc && pf) {
      condition = `WHERE sub_category.id = ${sc} ORDER BY p.price ${pf}`;
    }
    console.log(condition);

    return await appDataSource.query(
      `SELECT
      p.id,
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
    error.statusCode = 500;
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT
      p.id,
      p.names,
      p.price,
      p.sub_description,
      image.image_url,
      pd.descriptions AS detail,
      p.descriptions
      FROM product p
      JOIN sub_category
      ON p.sub_category_id = sub_category.id
      JOIN main_category
      ON sub_category.main_category_id = main_category.id
      JOIN  (SELECT product_id, JSON_ARRAYAGG(image_url) AS image_url FROM product_image GROUP BY product_id) AS image
      ON image.product_id = p.id
      JOIN product_detail pd
      ON pd.product_id = p.id
      WHERE p.id =?;
	 `,
      [productId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA_INPUT', 500);
  }
};

module.exports = {
  getProductById,
  categoryPage,
};
