require('dotenv').config()

// server/index.js
const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require("mongoose");

const app = express();
const port = 80;

app.use(cors());
// Serve the static files from the React app's build folder
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());

// Connect to MongoDB 
// (replace 'your_database_uri' with your actual MongoDB URI)
const url = process.env.MONGO_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for the volunteer model
const volunteerSchema = new mongoose.Schema({
    id: Number,
    name: String,
    event: String,
    date: String,
    startTime: String,
    endTime: String,
    status: String,
});

// Create a Volunteer model based on the schema
const Volunteer = mongoose.model("Volunteer", volunteerSchema);


// Fetch and load volunteer data from the database
app.get("/vols", async (req, res) => {
    try {
        const volunteerRequests = await Volunteer.find();
        res.json(volunteerRequests);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add a new volunteer
app.post("/addVolunteer", async (req, res) => {
    const newVolunteer = req.body;
    newVolunteer.status = "request";

    try {
        await Volunteer.create(newVolunteer);
        res.json({ message: "Volunteer added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Approve a volunteer
app.post("/approveVolunteer", async (req, res) => {
    const volunteerId = req.body.id;

    try {
        const result = await Volunteer.updateOne(
            { id: volunteerId },
            { status: "approved" }
        );

        if (result.nModified === 1) {
            res.json({ message: "Volunteer approved successfully" });
        } else {
            res.status(404).json({ message: "Volunteer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
