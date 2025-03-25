const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static assets from src folders
app.use("/css", express.static(path.join(__dirname, "src", "css")));
app.use("/img", express.static(path.join(__dirname, "src", "img")));
app.use("/script", express.static(path.join(__dirname, "src", "script")));
app.use("/pages", express.static(path.join(__dirname, "src", "pages")));

// Serve homepage from /src/pages/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "pages", "index.html"));
});

// Optional: route to contact.html
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "pages", "contact.html"));
});

// Email route
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("📩 Email submission received:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "parthshrestha12@gmail.com",
        pass: "otuecpqiywqhjhev"
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
