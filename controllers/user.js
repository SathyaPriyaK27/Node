// const { create } = require('domain');
// const { response } = require('express');
const { response } = require('express');
const User = require('../models/user')
const bcrypt = require('bcryptjs');



exports.singup= async(req,res)=>{

    const {username, password}= req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username || !password) {
        return res.status(400).json({response: {success: false,message: 'Username and password are required!'}});
    }
    try{
      const existingUser  =await User.findOne({where:{username}});
      if(existingUser){
        return res.status(400).json({response:{success:false,message:'Username was already exist!'}})
      }
      const existingPassword= await User.findOne({where:{password: hashedPassword}})
      if(existingPassword){
        return res.status(400).json({response:{success:false,message:'Password was already exist!'}})
      }
        const user = await User.create({username,password:hashedPassword});
        return res.status(201).json({response:{success:true,message:'User Successfully created',data:user}});
    }catch(err){
        console.error(err);
        return res.status(500).json({response:{success:false,message:'Internal server error'}});
    }
};

