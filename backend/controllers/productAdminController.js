const express=require("express");
const Product=require("../models/Product");
const {protect,admin}=require("../middleware/authmiddleware");
const router=express.Router();

//Route GET/api/admin/products
//@desc get all product (Admin only)
//@access Private/admin

router.get("/",protect,admin,async(req,res)=>{
    try {
        const products=await Product.find({});
        res.json(products); 
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
        
    }
})
module.exports=router;