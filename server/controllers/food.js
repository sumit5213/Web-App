const Food = require("../models/food")
const mongoose = require("mongoose")

async function addProducts(req, res, next) {
    const foodData = req.body;
    if (!Array.isArray(foodData)) {
        return next(new Error("data is required"))
    }

    const foodTypeInfo = [];
    for (const fooddata of foodData) {
        const { name, description, image, price, category, ingredients } = fooddata;
        const food = await Food.create({
            name,
            description,
            image,
            price,
            category,
            ingredients,
        });
        foodTypeInfo.push(food);
    }

    return res.status(201).json({ message: "products are added", foodTypeInfo })

}


async function getFoodItems(req, res, next) {
    let { categories, ingredients, minPrice, maxPrice, search } = req.query;
    categories = categories?.split(",");
    ingredients = ingredients?.split(",");
    const filter = {};
    if (categories && Array.isArray(categories)) {
        filter.categories = { $in: categories };
    }
    if (ingredients && Array.isArray(ingredients)) {
        filter.ingredients = { $in: ingredients };
    }
    if (maxPrice || minPrice) {
        filter["price.org"] = {};
        if (minPrice) {
            filter["price.org"]["$gte"] = parseFloat(minPrice);
        }
        if (maxPrice) {
            filter["price.org"]["$lte"] = parseFloat(maxPrice);
        }
    }
    if (search) {
        filter.$or = [
            { title: { $regex: new RegExp(search, "i") } },
            { desc: { $regex: new RegExp(search, "i") } },
        ];
    }

    const foodList = await Food.find(filter);
    return res.status(200).json(foodList);

}

async function getFoodById(req,res,next){
    const id = req.params.id;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json("invalid product id");
    };
    const food = await Food.findById(id);
    if(!food){
        return res.status(400).json("food not find");
    };
    return res.status(201).json(food);

}


module.exports = {
    addProducts, getFoodItems, getFoodById
}