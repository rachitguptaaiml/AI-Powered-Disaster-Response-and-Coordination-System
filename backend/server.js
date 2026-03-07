const express = require("express")
const app = express()

app.use(express.json())

let sos = []

app.post("/sos",(req,res)=>{
sos.push(req.body)
res.json({message:"SOS received"})
})

app.get("/sos",(req,res)=>{
res.json(sos)
})

app.listen(5000,()=>{
console.log("Server running")
})