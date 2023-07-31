//@ts-check
import {Schema, model} from 'mongoose'

export const OrderModel = model(
    'orders',
    new Schema({
        name: String,
        //categorias
        categorias:{
            type: String,
            enum:['Ropa', 'Caramelos', 'Electronicos', 'Muebles', 'Pop'],
        },
        // price:Number,
        // quantity: Number,
        // date: Date,
    })
)
