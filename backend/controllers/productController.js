const Product = require('../models/Product'); 
const mongoose = require('mongoose');
// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      images,
      isFeatured,
      isPublished,
      rating,
      numberReviews,
      tags,
      dimensions,
      weight,
      sku
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      images,
      isFeatured,
      isPublished,
      rating: rating || 0, // Default rating if not provided
      numberReviews: numberReviews || 0, // Default number of reviews if not provided
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, // Reference to the admin who created it
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).send("Server Error");
  }
};

const updateProduct=async(req,res)=>{
    try {
        const{name,description,price,discountPrice,countInStock,category,brand,sizes,colors,collections,material,images,isFeatured,isPublished,tags,dimensions,weight,sku}=req.body
       //find the product by id
       const product=await Product.findById(req.params.id);
       if(product){
        //update the product feild
        product.name=name||product.name;
        product.description=description||product.description;
        product.price=price||product.price;
        product.discountPrice=discountPrice||product.discountPrice;
        product.countInStock=countInStock||product.countInStock;
        product.category=category||product.category;
        product.brand=brand||product.brand;
        product.sizes=sizes||product.sizes;
        product.colors=colors||product.colors;
        product.collections=collections||product.collections;
        product.material=material||product.material;
        product.images=images||product.images;
        product.isFeatured=isFeatured!==undefined?isFeatured:product.isFeatured;
        product.isPublished=isPublished!==undefined?isPublished:product.isPublished;
        product.rating=product.rating; // Rating is not updated here, keep it as is
        product.numberReviews=product.numberReviews; // Number of reviews is not updated here, keep it as is
        product.tags=tags||product.tags;
        product.dimensions=dimensions||product.dimensions;
        product.weight=weight||product.weight;
        product.sku=sku||product.sku;

        //save the data product
        const updateProduct=await product.save();
            res.json(updateProduct);
       }else{
        res.status(404).json({message:"Product not found"})
       }
        
    } catch (error) {
        console.error(error);
        res.status(500).send("SErver, error")
    }
};


//@route DELETE/api/products
//@desc DELETE a priduct by id
//@access private /admin

const deleteProduct=async(req,res)=>{
    try {
        //find the product id
        const product =await Product.findById(req.params.id);
        if(product){
            //remove the product from db;
            await product.deleteOne();
            res.json({message:"product remove"});
        }else{
            res.status(404).json({message:"product not found"});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send("server Errror");
        
    }
};


//route GET/api/products
//desc GET all the products with optional query filters

const queryFilters=async(req,res)=>{
    try {
        const{collection,size,color,minPrice,maxPrice,sortBy,search,category,material,brand,limit}=req.query;
        
        let query={};
        //Filter logic

        if(collection && collection.toLocaleLowerCase()!== "all"){
            query.collections=collection;
        }
        if(category && category.toLocaleLowerCase()!== "all"){
            query.category=category;
        }
        if(material){
            query.material={$in:material.split(",")};
        }
        if(brand){
            query.brand={$in:brand.split(",")};
        }
        if(size){
            query.sizes={$in:size.split(",")};
        }
        if(color){
            query.colors={$in:[color]};
        }
        if(minPrice||maxPrice){
            query.price={};
            if(minPrice) query.price.$gte=Number(minPrice);
            if(maxPrice) query.price.$lte=Number(maxPrice);
        }
        if(search){
            query.$or=[
                {name:{$regex:search,$options:"i"}},
                {description:{$regex:search,$options:"i"}},


            ]
        }
        // sort Logic
        let sort={};
        if(sortBy){
            switch(sortBy){
                case "priceAsc":
                    sort={price:1};
                    break;
                case "priceDesc":
                    sort={price:-1};
                    break;
                case "popularity":
                    sort={rating:-1};
                    break;
                    default:
                        break;
                
            }
        }

         // Parse and validate limit param
         let parsedLimit = parseInt(limit, 10);
         if (isNaN(parsedLimit) || parsedLimit <= 0) {
         parsedLimit = 20; // or any safe default
        }

        //fetch produts from the database
        const products = await Product.find(query).sort(sort).limit(parsedLimit);
        res.json(products)
        


        
    } catch (error) {
        console.error(error);
        res.status(500).send("server error");

    }
};


//@route GET/api?product/bestSEller
//desc retrive the product with hight rating
//@access public

const bestSeller=async(req,res)=>{
    try {
       const bestSeller = await Product.findOne({ category: "Dresses" }).sort({ rating: -1 });

        if(bestSeller){
            res.json(bestSeller);
        }
        else{
            res.status(404).json({message:"no best seller Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("server Error");
    }
};


//homepage new Arrivals
const newArrivals = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).limit(8); // Fetch the latest 10 products
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

//othres pages
const categoryBased= async (req, res) => {
  try {
    const { category } = req.params;

    const validCategories = ["sarees", "dresses", "kidswear"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const products = await Product.find({
      category,
      isPublished: true
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};





//@route GET/api/products
//@desc get a single product by id
//@access public
const singleProduct=async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message:"product not found"});
        }
        
    } catch (error) {
        
        console.error(error);
        res.status(500).send("server Error");
    }
};

const categoryfilter= async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//similar products 
const similarProducts = async (req, res) => {
  const {id}=req.params;
    try {
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        const similarProducts=await Product.find({
            _id:{$ne:id},//Exclude the current product Id
            category:product.category
        }).limit(4);
        res.json(similarProducts)
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Sever error");

        
    }
};

//get products by filters

// GET /api/products?category=Sarees&search=silk

const getFilteredProducts = async (req, res) => {
  console.log('🔥 getFilteredProducts called', req.query);
  try {
    const { search, category } = req.query;
    const query = {};

    // ✅ Handle category filter (case-insensitive)
    if (category) {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    // ✅ Handle full-text search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i'); // .trim() removes spaces
      query.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { colors: { $regex: searchRegex } },
        { sku: { $regex: new RegExp(`^${search.trim()}$`, 'i') } }, // exact sku match
      ];
    }

    console.log('🔥 MongoDB Query:', JSON.stringify(query, null, 2)); // Debug log

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('❌ Search Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};





module.exports = {createProduct,updateProduct,deleteProduct,queryFilters,bestSeller,newArrivals,categoryBased,singleProduct,categoryfilter,similarProducts,getFilteredProducts };