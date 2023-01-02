import fs from 'fs'

class productManager {
  constructor(path) {
    this.path = path;
    this.init();
  }

  init = () => {
    if (fs.existsSync(this.path)) {
      return;
    } else {
      return fs.writeFileSync(
        this.path,
        JSON.stringify({ counter: 0, products: [] })
      );
    }
  };

  addProduct = async (title, description, price, thumbnail, category, stock, disponible) => {
    const objs = await this.getAll();
    try {
      const newObj = {
        id: objs.counter++,
        name: title,
        medidas: description,
        price: price,
        image: thumbnail,
        stock: stock,
        category: category,
        stockAvailability: true,
        oferta: false,
        disponible: disponible
      };
      objs.products.push(newObj);
      await fs.promises.writeFile(this.path, JSON.stringify(objs, null, 2));
      return newObj;
    } catch (error) {
      return res.send(error);
    }
  };

  getAll = async () => {
    try {
      const objs = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(objs)
    } catch (error) {
      if (error.message.includes("no such file or directory")) return [];
      else res.send(error);
    }
  }


  deleteAll = async () => {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify({ counter: 0, products: [] })
      );
      return;
    } catch (error) {
      res.send(error);
    }
  };

  getProductById = async (_id) => {
    try {
      const objs = await fs.promises.readFile(this.path, "utf-8");
      const { products } = await JSON.parse(objs);
      const obj = products.find(({ id }) => id === _id);
      return obj;
    } catch (error) {
      res.send(error);
    }
  };

  deleteProductById = async (_id) => {
    try {
      const objs = await this.getAll();
      const obj = objs.products.find((item)=> item.id === _id)
      if(!obj){
        return 'product does not exists'
      }
      const newObjs = objs.products.filter(({ id }) => id !== _id);
      objs.products = newObjs;

      await fs.promises.writeFile(this.path, JSON.stringify(objs, null, 2));
      return `product ${_id} deleted`;
    } catch (error) {
      return res.send(error);
    }
  };


  updateAllPrices = async(percentage) => {
    try {
      const products = await this.getAll();
      products.products.forEach((product) => product.price = Number(product.price)* (1+ (percentage/100)))
      await fs.promises.writeFile(this.path, JSON.stringify(products))
      return products
    } catch (error) {
      return error
    }
  }


  updateProduct = async (id, param) => {
    const product = await this.getProductById(id);
    const productParams = Object.keys(product);
    const objs = await this.getAll();
    const index = objs.products.findIndex((element) => element.id === id);
    if (!param) {
      return "Erorr, debe pasar al menos un parametro!";
    }
    if (param.id) {
      return 'No se puede alterar el ID'
    }
    const keys = Object.keys(param);
    keys.forEach((element) => {
      if (!productParams.includes(element)) {
        return `El parametro: ${element} no esxiste.`;
      }
      if (element === 'disponible') {
        product[element] = param[element]
        return
      }
      if(element === 'price' || element === 'stock') {
        product[element] = Number(param[element])
        return
      }
      product[element] = param[element] || product[element]

    });
    objs.products[index] = product;

    await fs.promises.writeFile(this.path, JSON.stringify(objs, null, 2));

    return objs.products[index] 
  };
}

export default productManager
