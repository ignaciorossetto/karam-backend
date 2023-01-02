import fs from 'fs'

class cartManager {
  constructor(path) {
    this.path = path;
    this.init();
  }

  init() {
    if (fs.existsSync(this.path)) {
      return;
    } else {
      fs.writeFileSync(this.path, JSON.stringify({ counter: 0, carts: [] }));
    }
  }

  createCart = async(obj) => {
    const carts = await this.getAll()
    const newCart = {
        id: carts.counter++,
        cartProducts: obj.products,
        shippingInfo: obj.shippingInfo,
        paymentInfo: obj.paymentInfo

    }
    carts.carts.push(newCart)
    await fs.promises.writeFile(this.path, JSON.stringify(carts))
    return 'New cart created!'
  }

  getAll = async () => {
    try {
      const objs = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(objs);
    } catch (error) {
      if (error.message.includes("no such file or directory")) return [];
      else return error;
    }
  }
  deleteAll = async () => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify({ counter: 0, carts: [] }));
      return 'All carts have been deleted'
    } catch (error) {
      return error
    }
  }

  getById = async (_id) => {
    try {
      const { carts } = await this.getAll();
      const obj = carts.find(({ id }) => id === _id);
      if(!obj){
        return false
      }
      return obj;
    } catch (error) {
      return error
    }
  };

  deleteById = async (_id) => {
    try {
      const carts = await this.getAll();
      const obj = carts.carts.filter(({ id }) => id !== _id);
      const objExists = carts.carts.find(({ id }) => id === _id);
      if(!objExists){
        return false
      }
      carts.carts = obj
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return `Cart ${_id} has been deleted`
    } catch (error) {
      return error
    }
  };

  addProductToCart = async(cartId, _productId) => {
    const allCarts = await this.getAll()
    const cart = allCarts.carts.find(({ id }) => id === cartId)
    if (!cart){
        return 'Cart Id doesnt exists, create cart first.'
    }
    const cartIndex = allCarts.carts.findIndex((_cart)=> _cart === cart)
    const obj = cart.cartProduct.find(({ productId }) => productId === _productId);
    if (!obj){
        cart.cartProduct.push({
            productId: _productId,
            quantity: 1
        })
        allCarts.carts[cartIndex] = cart
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2))
        return 'Product added to Cart'
    }
    const prodIndex = cart.cartProduct.findIndex((_obj)=> _obj === obj)
    cart.cartProduct[prodIndex].quantity++ 
    allCarts.carts[cartIndex] = cart
    await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2))
    return 'Product added to cart this way'
    
  }
}

export default cartManager