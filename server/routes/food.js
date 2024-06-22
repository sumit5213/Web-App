const express = require("express");
const {addProducts, getFoodItems, getFoodById} = require("../controllers/food");

const router = express.Router();

router.post("/addProduct",addProducts);
router.get("/getList",getFoodItems);
router.get("/getList/:id",getFoodById);

module.exports = router;