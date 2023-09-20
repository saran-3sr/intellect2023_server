const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const db = require('./db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


require('dotenv').config();

const app = express();

app.use(cors({origin:'*'}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn:'1d'})
}


//db.findOne({email:'amwahid2004@gmail.com'}).then(doc=>console.log(doc))
//db.updateOne({email},{userName:'anees'}).then(data=>console.log(data)).catch(err=>console.log(err));

app.post('/register',async (req,res)=>{
    const {email,userName,regNo,dept,event} = req.body;
    
    console.log({email,userName,regNo,dept,event})

    db.findOne({email}).then((exist)=>{
        if( exist ){
            console.log('email exists')
            /*
            console.log('Updating doc')
            console.log(event)
    
            db.updateOne({email},{$push:{events:event}}).then(data=>console.log(data)).catch(err=>console.log(err));    
            db.findOne({email}).then(data=>console.log(data));
    
            console.log('updated');
            */
            db.updateOne({email},{$push:{events:event}}).then(data=>console.log(data)).catch(err=>console.log(err));    

        }
        else{
            console.log('New email')
            const {email,userName,regNo,dept,event} = req.body;
            db.create({ email,userName,regNo,dept})
            db.updateOne({email},{$push:{events:event}})
                .then(()=>console.log('Saved'))
        }
    })


    
    
    res.json({"msg":"success"});

})

app.get('/data',(req,res)=>{
    db.find({}).then((data)=>{
        res.json(data);
    }).catch(err=>console.log(err))
})

app.delete('/data',(req,res)=>{
    const {_id} = req.body;
    db.findByIdAndDelete({_id})
        .then((data)=>{
            res.json({msg:'deleted'});
        })
        .catch(err=>console.log(err))
})

app.listen(process.env.PORT,()=>{
    console.log("Server is running..")
});