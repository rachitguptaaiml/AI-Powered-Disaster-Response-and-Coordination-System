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

/* ===============================
   🔹 DATABASE CONNECTION
================================ */
mongoose.connect("mongodb://127.0.0.1:27017/disasterDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>{
    console.error("DB Error:", err.message);
    process.exit(1);
});

/* ===============================
   🔹 SCHEMA & MODEL
================================ */
const sosSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    location: { type: String, default: "India" },
    lat: Number,
    lon: Number,
    status: { type: String, default: "NEW" },
    createdAt: { type: Date, default: Date.now }
});

const SOS = mongoose.model("SOS", sosSchema);

/* ===============================
   🔹 WEBSOCKET BROADCAST
================================ */
function broadcast(data){
    wss.clients.forEach(client=>{
        if(client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(data));
        }
    });
}

/* ===============================
   🔹 ROUTES
================================ */

/**
 * @route   POST /sos
 * @desc    Create SOS request
 */
app.post("/sos", async (req,res,next)=>{
    try{
        const { name, message } = req.body;

        if(!name || !message){
            return res.status(400).json({ error:"Name & message required" });
        }

        if(message.length < 5){
            return res.status(400).json({ error:"Message too short" });
        }

        const sos = new SOS({
            name,
            message,
            lat: 20 + Math.random()*10,
            lon: 75 + Math.random()*10
        });

        await sos.save();

        broadcast({ type:"NEW_SOS", data:sos });

        res.status(201).json({
            success:true,
            data:sos
        });

    }catch(err){
        next(err);
    }
});

/**
 * @route   GET /sos
 * @desc    Get all SOS requests
 */
app.get("/sos", async (req,res,next)=>{
    try{
        const data = await SOS.find().sort({createdAt:-1});
        res.json({ count:data.length, data });
    }catch(err){
        next(err);
    }
});

/**
 * @route   PUT /sos/:id
 * @desc    Update SOS status
 */
app.put("/sos/:id", async (req,res,next)=>{
    try{
        const updated = await SOS.findByIdAndUpdate(
            req.params.id,
            { status:req.body.status },
            { new:true }
        );

        if(!updated){
            return res.status(404).json({ error:"SOS not found" });
        }

        broadcast({ type:"UPDATE_SOS", data:updated });

        res.json({ success:true, data:updated });

    }catch(err){
        next(err);
    }
});

/**
 * @route   DELETE /sos/:id
 * @desc    Delete SOS
 */
app.delete("/sos/:id", async (req,res,next)=>{
    try{
        const deleted = await SOS.findByIdAndDelete(req.params.id);

        if(!deleted){
            return res.status(404).json({ error:"SOS not found" });
        }

        res.json({ success:true, message:"Deleted" });

    }catch(err){
        next(err);
    }
});

/* ===============================
   🔹 API DOCUMENTATION ROUTE
================================ */
app.get("/docs", (req,res)=>{
    res.json({
        endpoints: [
            { method:"POST", route:"/sos", body:"{name, message}" },
            { method:"GET", route:"/sos" },
            { method:"PUT", route:"/sos/:id", body:"{status}" },
            { method:"DELETE", route:"/sos/:id" }
        ],
        websocket: "ws://localhost:5000"
    });
});

/* ===============================
   🔹 GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next)=>{
    console.error("Error:", err.message);

    res.status(500).json({
        success:false,
        error:"Internal Server Error",
        details: err.message
    });
});

/* ===============================
   🔹 SERVER START
================================ */
wss.on("connection", ()=>{
    console.log("WebSocket client connected");
});

server.listen(5000, ()=>{
    console.log("Server running on port 5000");
});
