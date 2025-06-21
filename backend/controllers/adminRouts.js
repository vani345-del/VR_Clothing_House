const express=require("express");

const User=require("../models/User");
const {protect,admin}=require("../middleware/authmiddleware");

const router=express.Router();

//@route GET/api/admin/users
//@desc get all users(Admin only request)
//@acess Private/Admin
router.get("/",protect,admin,async(req,res)=>{
    try {
        const users=await User.find({});
        res.json(users);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Sever Error"});
        
    }
})


//@route POST /api/admin/users
//@desc Add new users (admin Only)
//@access Private/Admin
router.post("/",protect,admin,async(req,res)=>{
    const {name,email, password,role}=req.body;
    try {
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        user=new User({
            name,
            email,
            password,
            role: role || "customer"
        });
        await user.save();
        res.status(201).json({ message:"user created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
})

//router PUT/api/admin/users/:id
//@desc Update user info(admin only) -Name,email and role
//@access Private /Admin
router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(user){
            user.name=req.body.name||user.name;
            user.email=req.body.email||user.email;
            user.role=req.body.role||user.role;
        }
        const updateUser=await user.save();
        res.json({message:"User update succesfully",user:updateUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server Error"})
    }
});

//@route DELETE/api/admin/users/:id
//@desc DELETE user info (admin only)-Name email, and role
//@acces Privte/admin

router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message:"User deleted successful"})
        }else{
            res.status(404).json({message:"User not found"})
        }
        
    } catch (error) {
        console.error(500).json({message:"Sever error"})
        
    }
});



module.exports=router

