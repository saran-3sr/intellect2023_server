const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db.js');
const admin = require('./admin.js');
//const requireAuth = require("./middleware/requireAuth.js");
const path = require('path');


require('dotenv').config();

const app = express();

app.use(cors({origin:'*'}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));



app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });   

const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn:'1d'})
}

app.post('/register',async (req,res)=>{

    const {email,userName,regNo,dept,event, year, mobileNo} = req.body;
    
    db.findOne({regNo}).then((exist)=>{
        if( exist ){         
            db.updateOne({regNo},{$push:{events:event}})
                .then(()=>res.json({msg:'Email event Updated'}))
                .catch(err=>console.log(err));    
        }
        else{
            db.create({ email,userName,regNo,dept,year,mobileNo }).then(()=>{
                db.updateOne({regNo},{$push:{events:event}})
                    .then((msg)=>{res.json({msg:'New email added'})})
                    .then(()=>console.log('Saved and Updated the event'))
            })
        }
    })
})


app.post('/adminSignin', async (req,res)=>{
    try{
        const {email,password} = req.body;

        const doc = await admin.findOne({email});

        if(!doc)res.json({msg:'Invalid email'})
        if(!email || !password)res.json({msg:"Please fill every fields"})
		if(email && password){				
			bcrypt.compare(password, doc.password, function(err, match) {
				if (match) {
					const token = createToken(doc._id);
					res.json({email,token,msg:'success'})                        
				}
				else{
					res.json({msg:'Wrong Password'})
				}
			  })				
		}
    }
    catch(err){
        console.log(err)
    }
})


//app.use(requireAuth);

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
    if(searchField=='year'){
        db.find({year:searchValue})
            .then(data=>{
                res.json(data);
            })
    }
    else{
        query[searchField] = {$regex:`${searchValue}`,$options:'i'}
        db.find(query).then(data=>{
            res.json(data);
        })
    }
})

app.post('/eventFilter',(req,res)=>{
    const {eventValue} = req.body;
    
    const query = {};
    query['events'] = {$regex:`^${eventValue}`,$options:'i'}
    db.find(query).then(data=>{
        res.json(data);
    })
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

  app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
  });
app.listen(process.env.PORT, process.env.HOST, ()=>{
    console.log("Server is running..")
});