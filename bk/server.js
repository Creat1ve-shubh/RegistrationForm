const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.log("❌ Error:", err));

// Define a Schema
const FormDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

const FormData = mongoose.model("FormData", FormDataSchema);

// API Route to Save Form Data
app.post("/submit", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newEntry = new FormData({ name, email, message });
        await newEntry.save();
        res.status(201).json({ message: "✅ Data saved successfully" });
    } catch (err) {
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
