const fs = require("fs")
const express = require("express")
const app = express()

app.use(express.json())

let sos = []

app.post("/sos",(req,res)=>{

let data = req.body

fs.writeFileSync("sos.json", JSON.stringify(data, null, 2))

res.json({message:"SOS Stored Successfully"})

})

app.get("/sos",(req,res)=>{
res.sendFile(__dirname + "/sos.json")
})

app.listen(5000,()=>{
console.log("Server running")
})