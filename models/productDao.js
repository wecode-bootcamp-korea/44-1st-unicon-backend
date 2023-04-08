const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');
const conditionMake = require('./conditionMake');

const getProductList = async (
  mainCategory,
  subCategory,
  pricefilter,
  start,
  limit,
  isnew
) => {
  try {
    let filter = new conditionMake(
      mainCategory,
      subCategory,
      isnew,
      pricefilter
    );
    let condition = ``;
    filter.mainCondition();
    filter.subCondition();
    filter.newCondition();
    filter.priceCondition();
    if (mainCategory || subCategory || isnew || pricefilter)
      condition = `WHERE ` + filter.mixCondition();
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
