const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');

const getProductList = async (
  mainCategory,
  subCategory,
  pricefilter,
  start,
  limit,
  isnew
) => {
  try {
    let conditionMain = '';
    let order = 'ORDER BY p.id';
    let condition = '';
    let condition1 = [];

    if (mainCategory) {
      condition1.push(`main_category.id = ${mainCategory}`);
    }

    if (subCategory) {
      condition1.push(`sub_category.id = ${subCategory}`);
    }

    if (isnew) {
      condition1.push(`is_new IS NOT NULL`);
    }

    if (pricefilter) {
      order = `ORDER BY p.price ${pricefilter}`;
    }

    if (mainCategory || subCategory || isnew) {
      condition = `WHERE `;
      if (condition1.length != 1) {
        conditionMain = condition1.join(` AND `);
      }
      if (condition1.length == 1) {
        conditionMain = condition1;
      }
      condition = condition.concat(conditionMain);
    }

    const post = await appDataSource.query(
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
      LIMIT ? OFFSET ?
      ;`,
      [limit, start]
    );
    return post;
  } catch (err) {
    console.log(err);
    const error = new Error('INVAFAF');
    error.statusCode = 500;
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const productDetail = await appDataSource.query(
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
    return productDetail;
  } catch (err) {
    throw new baseError('INVALID_DATA_INPUT', 500);
  }
};

module.exports = {
  getProductById,
  getProductList,
};
