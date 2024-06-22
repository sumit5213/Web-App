require("dotenv").config()

const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user")
const foodRoutes = require("./routes/food")


const port = 3003;
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));


app.use("/api/user",userRoutes);
app.use("/api/foods",foodRoutes);



function connectDB(url) {
    return (mongoose.connect(url)
        .then(() => console.log("mongodb connected"))
        .catch((err) => console.log(err)))
}

const startServer = () => {
    try {
        connectDB("mongodb://127.0.0.1:27017/foodServer");
        app.listen(port, () => console.log(`port is started at : ${port}`))
    }
    catch (error) {
        console.log(error);
    }
}

startServer();