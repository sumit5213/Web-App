
const dotenv = require("dotenv");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Orders = require("../models/orders")

dotenv.config();

const error = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};

//Authentication 

async function UserRegisteration(req, res, next) {
    try {
        const { name, email, password, image } = req.body;
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return next(error(409, "email is already existed"));
        }

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            image,
        })
        // const createdUser = await user.save();
        const token = jwt.sign({
            id: user.id,
        },
            process.env.JWT
        );

        return res.status(201).json({ token, user });
    }
    catch (err) {
        next(err);
    }
}


async function UserLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return next(error(409, "user not found"));
        }
        const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
        // const  isPasswordCorrect = async ()=>{
        //     await bcrypt.compare(password,user.password,(err,res)=>{
        //         console.log(res)
        //     });
        // }

        // bcrypt.compa
        // User.findOn

        if (!isPasswordCorrect) {
            return next(error(403, "Incorrect Password"))
        }

        const token = jwt.sign({
            id: user.id
        },
            process.env.JWT
        )

        return res.status(201).json({ token, user })
    }
    catch (err) {
        next(err);
    }
}


//cart controllers:--
async function addToCart(req, res) {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const existingCartItemIndex = user.cart.findIndex((item) =>
        item.product.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
        user.cart[existingCartItemIndex].quantity += quantity;
    } else {
        user.cart.push({ product: productId, quantity });
    }
    await user.save();
    return res.status(200).json({ msg: "Product added to cart successfully", user });
}

async function updateCart(req, res, next) {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
        return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
        item.product.equals(productId)
    );
    if (productIndex !== -1) {
        if (quantity && quantity > 0) {
            user.cart[productIndex].quantity -= quantity;
            if (user.cart[productIndex].quantity <= 0) {
                user.cart.splice(productIndex, 1); // Remove the product from the cart
            }
        } else {
            user.cart.splice(productIndex, 1);
        }

        await user.save();

        return res
            .status(200)
            .json({ message: "product updated in cart", user });
    } else {
        return next(createError(404, "product not found in the user's cart"));
    }

}

async function getCartItems(req,res){
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Food",
    });
    const cartItems = user.cart;
    return res.status(200).json(cartItems);

}

//favourites items:

async function addToFavorites(req,res){
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res.status(200).json({ message: "item added to favorites", user });
}

async function getUsersFavourite(req,res,next){
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const favoriteProducts = user.favourites;
    return res.status(200).json(favoriteProducts);
}

async function removeFromFavorite(req,res,next){
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res.status(200).json({ message: "item removed from favorites", user });

}

//orders:
async function placeOrder(req,res,next){
    const { products, address, totalAmount } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });

    await order.save();
    user.cart = [];
    await user.save();
    return res.status(200).json({ message: "order placed successfully", order });
}

async function showAllOrders(req,res,next){
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }
    return res.status(200).json({ message: "all orders history", user });

}


module.exports = {
    UserRegisteration, UserLogin,
    addToCart, updateCart, getCartItems,
    addToFavorites, getUsersFavourite, removeFromFavorite,
    placeOrder, showAllOrders
}