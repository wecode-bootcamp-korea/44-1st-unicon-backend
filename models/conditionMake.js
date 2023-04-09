class conditionMake {
  constructor(mainCategory, subCategory, isnew, pricefilter) {
    this.mainCategory = mainCategory;
    this.subCategory = subCategory;
    this.isnew = isnew;
    this.pricefilter = pricefilter;
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
    if (this.isnew) order = ` ORDER BY p.price ${this.pricefilter}`;
    if (!this.isnew) order = ` ORDER BY p.id`;

    this.filter += order;
  }

  mixCondition() {
    if (this.condition.length != 1) this.filter = this.condition.join(` AND `);

    if (this.condition.length == 1) this.filter = this.condition;
    return this.filter;
  }
}

module.exports = conditionMake;
