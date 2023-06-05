const appDataSource = require('./appDataSource');

const conditionMake = require('./conditionMake');
const { DatabaseError } = require('../middlewares/error');

const searchProduct = async (word) => {
  try {
    let condition = '';
    let filter = new conditionMake('', '', '', '', word).build();
    if (filter) condition = `WHERE ` + filter;

    let products = await appDataSource.query(
      `SELECT
      p.id,
      p.names AS name,
      p.sub_description,
      sub_category.title AS subCategory,
      main_category.title AS mainCategory,
      image.image_url
      FROM product p
      JOIN sub_category
      ON p.sub_category_id = sub_category.id
      JOIN main_category
      ON sub_category.main_category_id = main_category.id
      JOIN  (SELECT product_id,
        JSON_ARRAYAGG(image_url) AS image_url
        FROM product_image 
        GROUP BY product_id) AS image
      ON image.product_id = p.id   
     ${condition}`
    );
    products ? products : (products = '');
    return products;
  } catch (err) {
    throw new DatabaseError('SEARCH_ERROR');
  }
};

const getShowRoom = async () => {
  try {
    return await appDataSource.query(
      `SELECT
      show_room.id,
      show_room.image_url,
      show_room.descriptions,
      show_room.header,
      po.products
    FROM show_room
    LEFT JOIN(
      SELECT 
      show_room_id,
      JSON_ARRAYAGG(JSON_OBJECT(
      "id", product.id,
      "name",product.names,
        "price",product.price,
        "sub_description",product.sub_description,
        "product_size",product_size,
        "image_url",(SELECT
      JSON_ARRAYAGG(image_url)
      FROM product_image
    WHERE product_image.product_id = product.id
      )
      ) )AS products
      FROM product
      GROUP BY show_room_id
      )po ON show_room.id = po.show_room_id
      `
    );
  } catch (err) {
    throw new DatabaseError('SHOWROOM_ERROR');
  }
};

const getProductList = async (
  mainCategory,
  subCategory,
  pricefilter,
  offset,
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

    let versity = filter.build();

    if (!mainCategory && !subCategory && !isnew) {
      condition = versity;
    } else {
      versity ? (condition = `WHERE ` + versity) : (versity = ``);
    }
    console.log(condition);

    const post = await appDataSource.query(
      `SELECT
      p.id,
      p.names,
      p.price,
      p.sub_description,
      p.is_new,
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
      [limit, offset]
    );
    return post;
  } catch (err) {
    throw new DatabaseError('FILTER_ERROR');
  }
};

const getProductById = async (productId) => {
  try {
    const [productDetail] = await appDataSource.query(
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
    throw new DatabaseError('INVALID_DATA_INPUT');
  }
};

module.exports = {
  getProductById,
  getProductList,
  getShowRoom,
  searchProduct,
};
