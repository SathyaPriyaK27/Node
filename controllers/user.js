// const { create } = require('domain');
// const { response } = require('express');
// const { response } = require('express');
const { response } = require('express');
const User = require('../models/user')
const bcrypt = require('bcryptjs');


const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};

exports.singup= async(req,res)=>{  

    const {username, password}= req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username && !password) {
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

      if (!validatePassword(password)) {
        return res.status(400).json({ response: {success: false,message: 'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.'
            }
        });
    }
        const user = await User.create({username,password:hashedPassword});
        return res.status(201).json({response:{success:true,message:'User Successfully created',data:user}});
    }catch(err){
        console.error(err);
        return res.status(500).json({response:{success:false,message:'Internal server error'}});
    }
};

exports.login = async(req,res)=>{
  const {username, password}= req.body;
  try{
      const user = await User.findOne({where:{username}});
      if(!user){
          return res.status(404).json({response:{success:false,message:'User not found'}});
      }
      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(404).json({response:{success:false,message:'Invalid credentials'}});
      }
      return res.status(200).json({success:true,message:'Login successfully',data:user});
  }catch(err){
     console.error(err)
     return res.status(500).json({response:{success:false,message:'Internal server error'}})
  }
}

