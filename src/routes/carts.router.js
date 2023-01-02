import { Router } from "express";
import { 
        getAll,
        deleteAll,
        createCart,
        getById,
        deleteById,
        addProductToCart 
    } from "../controllers/carts.controller.js";


const router = Router()



router.get('/', getAll)
router.delete('/', deleteAll)
router.post('/', createCart)
router.get('/:cid', getById)
router.delete('/:cid', deleteById)
router.post('/:cid/product/:pid', addProductToCart)


export default router
