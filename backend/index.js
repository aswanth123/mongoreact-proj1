// To connect with your mongoDB database
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Express app setup
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection using async/await
async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/", {
      dbName: "yourDB-name",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to yourDB-name database");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
connectDB();

// Schema for users of app
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("users", UserSchema);
User.createIndexes();

// Route to check if the backend is working
app.get("/", (req, resp) => {
  resp.send("App is Working");
  // You can check backend is working or not by
  // entering http://localhost:5000
  console.log("Backend is working");
});

// User registration endpoint
app.post("/register", async (req, resp) => {
  try {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    if (result) {
      delete result.password;
      resp.send(req.body);
      console.log(result);
    } else {
      console.log("User already registered");
    }
  } catch (e) {
    console.error(e);
    resp.status(500).send("Something Went Wrong");
  }
});

// Start the server
app.listen(5000, () => {
  console.log("App listening at port 5000");
});
