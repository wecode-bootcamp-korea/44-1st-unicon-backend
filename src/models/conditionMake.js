class conditionMake {
  constructor(mainCategory, subCategory, isnew, pricefilter, word) {
    this.mainCategory = mainCategory;
    this.subCategory = subCategory;
    this.isnew = isnew;
    this.pricefilter = pricefilter;
    this.word = word;
    this.condition = [];
    this.filter = ``;
  }

  mainCondition() {
    if (this.mainCategory)
      this.condition.push(`main_category.id = ${this.mainCategory}`);
  }

  subCondition() {
    if (this.subCategory)
      this.condition.push(`sub_category.id = ${this.subCategory}`);
  }

  newCondition() {
    if (this.isnew) this.condition.push(`is_new IS NOT NULL`);
  }

  priceCondition() {
    let order = '';
    if (this.pricefilter) order = ` ORDER BY p.price ${this.pricefilter}`;
    if (!this.pricefilter) order = ` ORDER BY p.id`;

    this.filter += order;
  }
  wordCondition() {
    if (this.word)
      this.condition
        .push(`p.names LIKE "%${this.word}%" or sub_category.title LIKE "%${this.word}%" or
    main_category.title LIKE "%${this.word}%"`);
  }

  mixCondition() {
    if (this.condition.length != 1) this.filter = this.condition.join(` AND `);
    if (this.condition.length == 1) this.filter = this.condition;
  }
  build() {
    this.mainCondition();
    this.subCondition();
    this.newCondition();
    this.wordCondition();
    this.mixCondition();
    this.priceCondition();
    return this.filter;
  }
}

class AddOrUpdate {
  constructor({ quantity, userId, productId }) {
    this.quantity = quantity;
    this.userId = userId;
    this.productId = productId;
  }
  add() {
    return `UPDATE cart
             SET quantity = quantity+ ?
             WHERE cart.user_id = ? AND cart.product_items = ? `;
  }
  update() {
    return `UPDATE cart
    SET quantity = ?
    WHERE cart.user_id = ? AND cart.product_items = ? `;
  }
}

module.exports = { conditionMake, AddOrUpdate };
