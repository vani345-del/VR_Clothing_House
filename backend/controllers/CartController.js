const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Utility: Get cart by userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// Utility: Normalize string (e.g., size, color)
const normalize = (value) => (value ? value.trim().toLowerCase() : "");

// POST /api/cart — Add product to cart
// POST /api/cart — Add product to cart
const addProductToCart = async (req, res) => {
  const { productId, quantity, size, color, guestId, userId, price, image } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const normalizedSize = normalize(size);
    const normalizedColor = normalize(color);

    let cart = await getCart(userId, guestId);

    const finalPrice = price || product.discountPrice || product.price;
    const selectedImage = image// ✅ fallback if no image sent
    

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          normalize(p.size) === normalizedSize &&
          normalize(p.color) === normalizedColor
      );

      if (productIndex > -1) {
        // ✅ Update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // ✅ Add new product with selected image
        cart.products.push({
          productId,
          name: product.name,
          image: selectedImage,
          price: finalPrice,
          size: normalizedSize,
          color: normalizedColor,
          quantity,
        });
      }

      // ✅ Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // ✅ Create new cart with selected image
      const newCart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: selectedImage,
            price: finalPrice,
            size: normalizedSize,
            color: normalizedColor,
            quantity,
          },
        ],
        totalPrice: finalPrice * quantity,
      });

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// PUT /api/cart — Update quantity or remove product
const updateProductQuantity = async (req, res) => {
  const { productId, quantity, size, color, guestId, userId,price} = req.body;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const normalizedSize = normalize(size);
    const normalizedColor = normalize(color);

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        normalize(p.size) === normalizedSize &&
        normalize(p.color) === normalizedColor
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        // ✅ Get the latest product price from DB
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const updatedPrice = product.discountPrice || product.price;

        // ✅ Update quantity & price
        cart.products[productIndex].quantity = quantity;
        cart.products[productIndex].price = updatedPrice;

      } else {
        // ❌ If quantity is 0, remove item
        cart.products.splice(productIndex, 1);
      }

      // ✅ Recalculate totalPrice correctly
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


//@route DELETE/api/cart
//@desc remove a product from the cart
//@access public

const deleteItem=async(req,res)=>{
    const {productId,size,color,guestId,userId}=req.body;
    try {
        
        let cart=await getCart(userId,guestId);
        if(!cart) return res.status(404).json({message:"cart not found"});
        const productIndex=cart.products.findIndex(
            (p)=>
            p.productId.toString()===productId &&
            p.size===size &&
            p.color===color
        );
        if(productIndex>-1){
            cart.products.splice(productIndex,1);
            cart.totalPrice=cart.products.reduce(
                (acc,item)=>acc+item.price*item.quantity,0
            );
            await cart.save();
            return res.status(200).json(cart);
        }else{
            return res.status(404).json({message:"product not found in the cart"})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"server error"});
        
    }
};

//@route GET /api/cart
//@desc GET logged-in uses or the guest user cart
//@access Public


const getUserCart = async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//@router POST/api/cart/merge
//@desc MERge guest cart into the user cart on login
//@access private

const mergeCart=async(req,res)=>{
    const {guestId} =req.body;
    try {
        //find the guest cart and the user cart
        const guestCart=await Cart.findOne({guestId});
        const userCart=await Cart.findOne({user:req.user._id});
        if(guestCart){
            if(guestCart.products.length===0){
                return res.status(400).json({message:"guest cart is empty"});
            }
            if(userCart){
                //Merge guest cart into user cart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex=userCart.products.findIndex((item)=>
                        item.productId.toString()===guestItem.productId.toString() &&
                        item.size===guestItem.size && 
                        item.color===guestItem.color
                    );
                 if(productIndex>-1){
                    //if the item exists inn the user cart, update the quantity
                    userCart.products[productIndex].quantity+=guestItem.quantity;
                 }else{
                    //otherwise add the guest item to the caart
                    userCart.products.push(guestItem);
                 }
                });
                userCart.totalPrice=userCart.products.reduce(
                    (acc,item)=>acc +item.price * item.quantity,0
                )
                await userCart.save();

                //remove the guest cart after merging
                try {
                    
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                    console.error("Error deleting guest cart: ",error);
                    
                }
                res.status(200).json(userCart);


            }else{
                // if the user has no existing cart,assign the guest cart to the user
                guestCart.user=req.user._id;
                guestCart.guestId=undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        }else{
            if(userCart){
                //guest cart has alresdy been merged return user cart
                return res.status(200).json(userCart);
            }
            res.status(404).json({message:"guest cart not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
        
    }
};











module.exports = {
  addProductToCart,
  updateProductQuantity,
  deleteItem,
  getUserCart,
  mergeCart
};
