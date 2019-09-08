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
}