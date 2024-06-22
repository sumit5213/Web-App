const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
    },
    email :{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:null,
    },
    favourite :{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"food",
        default:[],
    },
    orders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"orders",
        default:[]
    },
    cart:{
        type:[{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"food",
            },
            quantity:{
                type:Number,
                default:1,
            }
        }],
        default:[],
    }

},{
    timestamps:true,
})

const user = mongoose.model("users",UserSchema)
module.exports = user