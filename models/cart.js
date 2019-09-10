module.exports = class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  };

  add(item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {itemInfor: item, quantity: 0, price: 0};    //add 1 item to cart
    }
    storedItem.quantity++;
    storedItem.price += storedItem.itemInfor.price;
    this.totalPrice += storedItem.itemInfor.price;
    this.totalQty++;
  };

  reduceByOne(id) {
    this.items[id].quantity--;
    this.totalQty--;
    this.items[id].price -= this.items[id].itemInfor.price;
    this.totalPrice -=this.items[id].itemInfor.price;
    if (this.items[id].quantity===0) {
      delete this.items[id];
    }
  }

  removeItem(id) {
    this.totalQty -= this.items[id].quantity;
    this.totalPrice -= this.items[id].price
    delete this.items[id];
  }

  generateArray() {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
}