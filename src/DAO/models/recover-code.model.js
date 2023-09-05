import {Schema, model} from "mongoose"

export const RecoverCodesMongoose= model (
    "recover-codes",
    new Schema({
        code: {type: String, required: true},
        email: {type: String, required: true},
        expire: {type: Number, required: true},
    })
)