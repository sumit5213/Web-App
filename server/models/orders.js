const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    totalAmount :{
        type:String,
        required:true,
    },
    address :{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"payment done",
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    
    product:{
        type:[{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"food",
                required:true,
            },
            quantity:{
                type:Number,
                default:1,
            }
        }],
        required:true,
    }

},{
    timestamps:true,
})

const order = mongoose.model("orders",OrderSchema);
module.exports = order;