const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/disasterDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// 🔹 Schema
const sosSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    location: { type: String, default: "Unknown" },
    status: { type: String, default: "NEW" },
    createdAt: { type: Date, default: Date.now }
});

const SOS = mongoose.model("SOS", sosSchema);

// 🔹 CREATE SOS
app.post("/sos", async (req, res) => {
    try {
        const { name, message, location } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: "Missing fields" });
        }

        if (message.length < 5) {
            return res.status(400).json({ error: "Message too short" });
        }

        const sos = new SOS({ name, message, location });
        await sos.save();

        res.json({ success: true, data: sos });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 GET SOS
app.get("/sos", async (req, res) => {
    try {
        const data = await SOS.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 UPDATE STATUS
app.put("/sos/:id", async (req, res) => {
    try {
        const updated = await SOS.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 DELETE
app.delete("/sos/:id", async (req, res) => {
    try {
        await SOS.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on 5000"));
