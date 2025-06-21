
const Checkout=require("../models/CheckOuts");
const Cart=require("../models/Cart");
const Order=require("../models/Order");





//@route POST/api/checkout
//@desc Create a new checkout session
//@access private
const checkout=async(req,res)=>{
    const{checkoutItems,shippingAddress,paymentMethod,totalPrice}=req.body;
    if(!checkoutItems||checkoutItems.length===0){
        return res.status(400).json({message:"no items in checkout"});
    }
    try {
        //create a new checkout session
        const newCheckout=await Checkout.create({
            user:req.user._id,
            checkoutItems:checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus:"Pending",
            isPaid:false,
        });
        console.log(`Checkout created for user:${req.user._id}`);
        res.status(201).json(newCheckout);
        } catch (error) {
            console.error("Error creating checkout session:",error);
            res.status(500).json({message:"server error"});
        
    }
};


//@route PUT/api/checkout/:id/pay
//@desc Update  checkout to mark as paid after successful payment
//@access private

const payCheckout = async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();

      await checkout.save();
      return res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: "Invalid payment status" });
    }

  } catch (error) {
    console.error("Error in payCheckout:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkoutand conver to an order after payment confirmation
//@access Private 

const finalize=async(req,res)=>{
    try {
        const checkout=await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Chcekout not found"});

        }
        if(checkout.isPaid && !checkout.isFinalized){
            //crete final order based on the checkout details
            const finalOrder=await Order.create({
                user:checkout.user,
                orderItems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                paymentDetails:checkout.paymentDetails,

            });
            //Mark the checkout as finalized
            checkout.isFinalized=true;
            checkout.finalizedAt=Date.now();
            await checkout.save();
            // Delte the cart associated with the user
            await Cart.findOneAndDelete({user:checkout.user});
            res.status(201).json(finalOrder);

        }
        else if(checkout.isFinalized){
            res.status(400).json({message:"checkout already finalized"})

        }
        else{
            res.status(400).json({message:"Checkout is not paid"});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
        
    }
};
module.exports={checkout, payCheckout, finalize};   