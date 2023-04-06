const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');

const getProductById = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT
      p.names,
      p.price,
      p.sub_description,
      image.image_url,
      pd.descriptions AS detail
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
};
