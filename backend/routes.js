const express = require("express")
const router = express.Router()

let sos = []

router.post("/sos",(req,res)=>{
sos.push(req.body)
res.json({message:"SOS stored"})
})

router.get("/sos",(req,res)=>{
res.json(sos)
})

module.exports = router