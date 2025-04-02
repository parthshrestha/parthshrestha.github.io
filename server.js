require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// mongoose
//   .connect(process.env.MONGO_URI || "mongodb://localhost:27017/authDemo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "pages"));
app.use("/css", express.static(path.join(__dirname, "src", "css")));
app.use("/img", express.static(path.join(__dirname, "src", "img")));
app.use("/script", express.static(path.join(__dirname, "src", "script")));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
