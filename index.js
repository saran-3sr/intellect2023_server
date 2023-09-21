const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db.js');
const admin = require('./admin.js');
const requireAuth = require("./middleware/requireAuth.js");


require('dotenv').config();

const app = express();

app.use(cors({origin:'*'}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));



const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn:'1d'})
}

app.post('/register',async (req,res)=>{

    const {email,userName,regNo,dept,event} = req.body;
    
    db.findOne({email}).then((exist)=>{
        if( exist ){
            console.log('email exists')
         
            db.updateOne({email},{$push:{events:event}}).then(data=>console.log(data)).catch(err=>console.log(err));    

        }
        else{
            console.log('New email')
            const {email,userName,regNo,dept,event} = req.body;
            db.create({ email,userName,regNo,dept})
            db.updateOne({email},{$push:{events:event}})
                .then(()=>console.log('Saved and Updated the event'))
        }
    })
})


app.post('/adminSignin', async (req,res)=>{
    try{
        const {email,password} = req.body;

        const doc = await admin.findOne({email});

        if(!doc)res.json({msg:'Invalid email'})
        if(!email || !password)res.json({msg:"Please fill every fields"})

        bcrypt.compare(password, doc.password, function(err, match) {
            if (err){
              console.log('err occured\n',err)
            }
            if (match) {
                if(email && password){
                    if(match){
                        const token = createToken(doc._id);
                        res.json({email,token,msg:'success'})                        
                    }
                    else{
                        res.json({msg:'Wrong Password'})
                    }
                }
            }
          });        
    }
    catch(err){
        console.log(err)
    }
})

app.use(requireAuth);

app.post('/createAdmin',async (req,res)=>{
    const {email,password,userName} = req.body;
    const hashed = await bcrypt.hash(password, 10)
    admin.create({email,password:hashed,userName})
        .then(()=>console.log('Saved'))
    
    res.json({"msg":"success"});

})

app.post('/filter',(req,res)=>{
    const {searchValue,searchField} = req.body;
    
    const query = {};
    query[searchField] = searchValue
    db.find(query).then(data=>{
        res.json(data);
    })
    
    /*
    db.find({searchField:searchValue}).then((data)=>{
        console.log(data);res.json(data);
    }).catch(err=>console.log(err))
    */
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