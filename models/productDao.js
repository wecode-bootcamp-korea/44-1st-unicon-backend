const appDataSource = require('./appDataSource');
const { baseError } = require('../middlewares/error');

const getProductByProductId = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT 
		  p.names,
      p.descriptions,
      p.sub_description,
      p.sub_category_id,
      p.price,
      product_size,
      p.is_new,
      i.image_url
      FROM product p
      JOIN product_image i
      ON p.id = i.product_id
      WHERE product.id = ?;
	 `[productId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA_INPUT', 400);
  }
};

const getDetailByProductId = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT 
      descriptions
      FROM product_detail
      WHERE product_detail.product_id=?;
	 `[productId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA_INPUT', 400);
  }
};

module.exports = { getProductByProductId, getDetailByProductId };
