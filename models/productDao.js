const appDataSource = require('./appDataSource');
const { BaseError } = require('../middleware/error');

const getProductByProductId = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT 
		  names,
      descriptions,
      sub_description,
      sub_category_id,
      price,
      product_size,
      is_new
      FROM product
      WHERE product.id=?;
	 `[productId]
    );
  } catch (err) {
    throw new BaseError(err, 400);
  }
};
module.exports = { getProductByProductId };
