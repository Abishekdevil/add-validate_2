const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 4000;

app.use(express.json());

const uri = process.env.uri;
mongoose.connect(uri)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err));

const Userdetails = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
});

const Detail = mongoose.model("detail", Userdetails);


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    
    const user = await Detail.findOne({ Email: email.toLowerCase() });

    console.log("User found:"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
