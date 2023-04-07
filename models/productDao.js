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
    let conditionSub = '';
    let order = 'ORDER BY p.id';
    let conditionIsNew = '';
    let condition = '';
    if (mainCategory) {
      conditionMain = `main_category.id = ${mainCategory}`;
    }

    if (subCategory) {
      conditionSub = `sub_category.id = ${subCategory}`;
    }

    if (isnew) {
      conditionIsNew = `is_new IS NOT NULL`;
    }

    if (pricefilter) {
      order = `ORDER BY p.price ${pricefilter}`;
    }

    if (mainCategory || subCategory || isnew) {
      condition = `WHERE `;
      const array = [conditionMain, conditionSub, conditionIsNew];
      array.forEach((str, index) => {
        if (str && (index == 0 || !array[index - 1])) {
          condition += str;
        }
        if (str && (index != 0) & array[index - 1]) {
          condition += ` AND `;
          condition += str;
        }
      });
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
      LIMIT ? OFFSET ?
      ;`,
      [start, limit]
    );
  } catch (err) {
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
  getProductList,
};
