import { Router } from "express";
import multer from "multer";
import __dirname from "../utils.js";
import { 
  getAll, 
  getById, 
  addProduct,
  updateById,
  updateAllPrices,
  temporaryImage,
  deleteById,
  deleteAll,
  updateStock
} from "../controllers/products.controller.js";

// Products router created
const router = Router();

// Multer set up
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/imagenesprovisorias");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const storage_2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/multimedia/nuevosproductos");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadToServer = multer({ storage: storage_2 });

//    ROUTES

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", uploadToServer.single("image"), addProduct);
router.put("/:id", updateById);
router.put("/", updateAllPrices);
router.delete("/:id", deleteById);
router.delete("/", deleteAll);
router.patch("/sale", updateStock);

// Aca agregue una funcion para que no se acumulen imagenes en la carpeta de imagenes provisorias!!
router.patch("/", upload.single("file"), temporaryImage);


export default router;
