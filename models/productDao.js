const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');

const categoryPage = async (mc, sc, pf, start, count, isnew) => {
  try {
    let condition = '';
    let order = '';
    if (sc) {
      condition = `WHERE sub_category.id = ${sc}`;
    }

    if (mc) {
      condition = `WHERE main_category.id = ${mc}`;
    }

    if (isnew) {
      condition = `WHERE is_new IS NOT NULL`;
    }

    if (mc & isnew) {
      condition = `WHERE main_category.id = ${mc} AND is_new IS NOT NULL`;
    }

    if (sc && isnew) {
      condition = `WHERE sub_category.id = ${sc} AND is_new IS NOT NULL`;
    }

    if (pf) {
      order = `ORDER BY p.price ${pf}`;
    }
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
      ${order}
      LIMIT ? OFFSET ?;
      ;`,
      [count, start]
    );
  } catch (err) {
    console.log(err);
    throw new baseError('INVALID_DATA', 500);
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
