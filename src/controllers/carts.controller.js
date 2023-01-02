import cartManager from '../managers/cartManager.js'
import productManager from "../managers/productManager.js";
import __dirname from "../utils.js";

const prodManager = new productManager(__dirname + '/managers/db/products.json');
const manager = new cartManager(__dirname + '/managers/db/carts.json')

export const getAll = async(req,res)=>{
    const response = await manager.getAll()
    return res.json(response)
}

export const deleteAll = async(req,res)=>{
    const response = await manager.deleteAll()
    return res.json(response)
}

export const createCart = async(req,res)=>{
    console.log('hitted');
    const response = await manager.createCart(req.body)
    return res.json(response)
}

export const getById = async(req,res)=>{
    const id = Number(req.params.cid)
    const cart = await manager.getById(Number(id))
    if(!cart){
        return res.json('Cart ID does not exists')
    }
    return res.json(cart)  
}

export const deleteById = async(req,res)=>{
    const id = Number(req.params.cid)
    const cart = await manager.deleteById(id)
    console.log(cart);
    if(!cart){
        return res.json('Cart ID does not exists')     
    }
    return res.json(cart)
}

export const addProductToCart = async(req,res)=>{
    try {
        const cid = Number(req.params.cid)
        const pid = Number(req.params.pid)
        const cart = await manager.getById(cid)
        const product = await prodManager.getProductById(pid)
        if(!cart){
            res.json('Cart ID does not exists')
            return
        }
        if(!product){
            res.json('Product ID does not exists')
            return
        }
        const response = await manager.addProductToCart(cid, pid)
        res.json(response)
    } catch (error) {
     res.json(error)   
    }
}