const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');

const getProductByProductId = async (productId) => {
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
    throw new baseError('INVALID_DATA_INPUT', 400);
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
    throw new baseError('INVALID_DATA_INPUT', 400);
  }
};

module.exports = {
  getProductByProductId,
  getDetailByProductId,
};
