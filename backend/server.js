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

// ---------------- DB CONNECTION ----------------
mongoose.connect("mongodb://127.0.0.1:27017/disasterDB")
.then(() => console.log("DB connected"))
.catch(err => {
    console.log("DB error:", err.message);
    process.exit(1);
});

// ---------------- MODEL ----------------
const sosSchema = new mongoose.Schema({
    name: String,
    message: String,
    location: { type: String, default: "India" },
    lat: Number,
    lon: Number,
    status: { type: String, default: "NEW" },
    createdAt: { type: Date, default: Date.now }
});

const SOS = mongoose.model("SOS", sosSchema);

// ---------------- WEBSOCKET ----------------
function sendToClients(payload) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
        }
    });
}

wss.on("connection", () => {
    console.log("Client connected (WS)");
});

// ---------------- ROUTES ----------------

// create SOS
app.post("/sos", async (req, res) => {
    try {
        const { name, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: "Missing name or message" });
        }

        if (message.length < 5) {
            return res.status(400).json({ error: "Message too short" });
        }

        const newSOS = new SOS({
            name,
            message,
            lat: 20 + Math.random() * 10,
            lon: 75 + Math.random() * 10
        });

        await newSOS.save();

        sendToClients({ type: "NEW", data: newSOS });

        res.status(201).json(newSOS);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get all SOS
app.get("/sos", async (req, res) => {
    try {
        const list = await SOS.find().sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update status
app.put("/sos/:id", async (req, res) => {
    try {
        const updated = await SOS.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Not found" });
        }

        sendToClients({ type: "UPDATE", data: updated });

        res.json(updated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// delete
app.delete("/sos/:id", async (req, res) => {
    try {
        await SOS.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// simple docs route
app.get("/docs", (req, res) => {
    res.json({
        endpoints: [
            "POST /sos",
            "GET /sos",
            "PUT /sos/:id",
            "DELETE /sos/:id"
        ]
    });
});

// ---------------- START SERVER ----------------
server.listen(5000, () => {
    console.log("Server running on port 5000");
});
