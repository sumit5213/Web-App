const express = require("express");

const {verifyToken} = require("../middlewares/authenticate");

const {UserRegisteration,UserLogin,
    addToCart, updateCart, getCartItems,
    addToFavorites, getUsersFavourite, removeFromFavorite,
    placeOrder, showAllOrders} = require("../controllers/user");

const router = express();

router.post("/signup",UserRegisteration);
router.post("/signin",UserLogin);

router.post("/cart",verifyToken,addToCart);
router.get("/cart",verifyToken,getCartItems);
router.patch("/cart",verifyToken,updateCart);

router.post("/favourite",verifyToken,addToFavorites);
router.get("/favourite",verifyToken,getUsersFavourite);
router.patch("/favourite",verifyToken,removeFromFavorite);

router.post("/order",verifyToken,placeOrder);
router.get("/order",verifyToken,showAllOrders);

module.exports = router;