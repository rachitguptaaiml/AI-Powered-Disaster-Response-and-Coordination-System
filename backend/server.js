const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());

// 🔹 MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/disasterDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// 🔹 Schema
const sosSchema = new mongoose.Schema({
    name: String,
    message: String,
    location: String,
    lat: Number,
    lon: Number,
    status: { type: String, default: "NEW" },
    createdAt: { type: Date, default: Date.now }
});

const SOS = mongoose.model("SOS", sosSchema);

// 🔹 WebSocket broadcast
function broadcast(data){
    wss.clients.forEach(client=>{
        if(client.readyState===WebSocket.OPEN){
            client.send(JSON.stringify(data));
        }
    });
}

// 🔹 CREATE SOS
app.post("/sos", async (req,res)=>{
    try{
        const { name, message } = req.body;

        if(!name || !message){
            return res.status(400).json({error:"Missing fields"});
        }

        const sos = new SOS({
            name,
            message,
            location: "India",
            lat: 20 + Math.random()*10,
            lon: 75 + Math.random()*10
        });

        await sos.save();

        // 🔥 REAL-TIME PUSH
        broadcast({ type:"NEW_SOS", data:sos });

        res.json({success:true,data:sos});

    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// 🔹 GET ALL
app.get("/sos", async (req,res)=>{
    const data = await SOS.find().sort({createdAt:-1});
    res.json(data);
});

// 🔹 UPDATE STATUS
app.put("/sos/:id", async (req,res)=>{
    const updated = await SOS.findByIdAndUpdate(
        req.params.id,
        { status:req.body.status },
        { new:true }
    );

    broadcast({ type:"UPDATE_SOS", data:updated });

    res.json(updated);
});

// 🔹 DELETE
app.delete("/sos/:id", async (req,res)=>{
    await SOS.findByIdAndDelete(req.params.id);
    res.json({success:true});
});

// 🔹 WebSocket connection
wss.on("connection", (ws)=>{
    console.log("Client connected");
});

server.listen(5000, ()=>{
    console.log("Server running on 5000");
});
