import express from "express"
import controlador from "./../dao/controlador.js"
const useMongo = true; 

const { productManager } = controlador(useMongo);

export  const realTimeProdsRouters = express.Router()

realTimeProdsRouters.get("/",async (req,res)=>{
    try {
        const products = await productManager.getProducts()
        return res.render("realTimeProducts", {products:products})
    } catch (error) {
        res.status(500).json({ succes: "false", msg: "Error", payload: {} });
    }
})
