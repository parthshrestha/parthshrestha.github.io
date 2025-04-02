require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./src/models/User");

const app = express();
const PORT = process.env.PORT || 3000;
//mongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/authDemo")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

//setting up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "pages"));

// Serve static files
app.use("/css", express.static(path.join(__dirname, "src", "css")));
app.use("/img", express.static(path.join(__dirname, "src", "img")));
app.use("/script", express.static(path.join(__dirname, "src", "script")));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.get("/", (req, res) => {
  res.render("index", { page: "home" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { page: "contact" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "about" });
});

app.get("/experience", (req, res) => {
  res.render("experience", { page: "experience" });
});

app.get("/projects", (req, res) => {
  res.render("projects", { page: "projects" });
});

app.get("/blog", (req, res) => {
  res.render("blog", { page: "blog" });
});
app.get("/login", (req, res) => {
  res.render("login");
});
//Sign-Up Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    console.log("✅ User created:", newUser.email);
    res.status(201).send("User created successfully!");
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).send("Something went wrong during signup");
  }
});

//log-In Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).send("Incorrect password");

    res.render("welcome", { user }); // success — render welcome.ejs
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).send("Login failed");
  }
});

// Email route
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("📩 Email submission received:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: "parthshrestha12@gmail.com",
      subject: `[Contact Form] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email failed.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
