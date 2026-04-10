const express = require("express")
const fs = require("fs")
const app = express()

app.use(express.json())

const API_KEY = "12345"

// POST SOS
app.post("/sos",(req,res)=>{

try{

if(req.headers.authorization !== API_KEY){
return res.status(403).json({message:"Unauthorized"})
}

if(!req.body.name || !req.body.msg){
return res.json({message:"Invalid input"})
}

if(req.body.msg.length < 5){
return res.json({message:"Message too short"})
}

let data = []

if(fs.existsSync("sos.json")){
data = JSON.parse(fs.readFileSync("sos.json"))
}

data.push({
name:req.body.name,
msg:req.body.msg,
time:new Date()
})

fs.writeFileSync("sos.json",JSON.stringify(data,null,2))

res.json({message:"Stored"})

}catch{
res.status(500).json({message:"Server error"})
}

})

// GET SOS
app.get("/sos",(req,res)=>{

if(fs.existsSync("sos.json")){
res.sendFile(__dirname + "/sos.json")
}else{
res.json({message:"No SOS"})
}

})

app.listen(5000,()=>{
console.log("Server running on port 5000")
})
