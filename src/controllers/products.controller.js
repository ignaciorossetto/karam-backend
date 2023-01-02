import productManager from "../managers/productManager.js";
import __dirname from "../utils.js";
import fs from "fs";

const manager = new productManager(__dirname + "/managers/db/products.json");

export const getAll = async (req, res) => {
  const products = await manager.getAll();
  if (req.query.category) {
    return res.json(
      products.products.filter((prod) => prod.category === req.query.category)
    );
  }
  return res.json(products.products);
};

export const getById = async (req, res) => {
  const id = Number(req.params.id);
  const product = await manager.getProductById(Number(id));
  if (!product) {
    return res.json(`No se encontro el producto con id: ${id}`);
  }
  res.json(product);
};

export const addProduct = async (req, res) => {
  await manager.addProduct(
    req.body.title,
    req.body.description,
    parseInt(req.body.price),
    `http://127.0.0.1:5000/static/images/multimedia/nuevosproductos/${req.file.filename}`,
    req.body.category,
    parseInt(req.body.stock),
    req.body.disponible === "true" ? true : false
  );
  res.json("product created");
};

export const updateById = async (req, res) => {
  const id = Number(req.params.id);
  const response = await manager.updateProduct(id, req.body);
  res.json(response);
};

export const updateAllPrices = async (req, res) => {
  const data = Number(req.body.percentage);
  await manager.updateAllPrices(data);
  res.json(`Se actualizaron todos los precios un ${data}%`);
};

export const temporaryImage = async (req, res) => {
  const files = fs.readdirSync(
    __dirname.slice(0, -4) + `/public/images/imagenesprovisorias`
  );
  for (let index = 0; index < files.length; index++) {
    if (files[index] !== req.body.name) {
      console.log(files[(index, req.body.name)]);
      fs.unlinkSync(
        __dirname.slice(0, -4) +
          `/public/images/imagenesprovisorias/${files[index]}`
      );
    }
  }

  res.json(
    `http://127.0.0.1:5000/static/images/imagenesprovisorias/${req.body.name}`
  );
};

export const deleteById = async (req, res) => {
  const id = Number(req.params.id);
  const response = await manager.deleteProductById(id);
  res.json(response);
};

export const deleteAll = async (req, res) => {
  const response = await manager.deleteAll();
  res.json(response);
};

export const updateStock = async(req, res) => {
  // foreach loop does not work async, it never stops. the correct way to iterate
  // with async functions inside is this for await of loop.
  const obj = req.body
  const arr = []
  for await(const element of obj.products) {
    const product = await manager.getProductById(element.id)
    product.stock -= element.quantity
    if (product.stock < 0) {
      arr.push(product)
    }
  }
  if (arr.length > 0) {
    return res.status(400).json({products: arr})
  } else {
    for await (const element of obj.products) {
      const product = await manager.getProductById(element.id)
      product.stock -= element.quantity
      await manager.updateProduct(element.id, {stock: product.stock})
    }
  }

  return res.status(200).json('updated')
}
