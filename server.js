const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.get("/", (req, res) => res.json({ msg: "Welcome to Contact Keeper API" }));

//Connect the Database
connectDB();

//Init Middleware

app.use(express.json({ extended: false })); // enables accepting the body data

app.get("/", (req, res) => {
  res.send("Welcome to ContactKeeper API ...");
});

//Define Routes

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/apple", require("./routes/apple"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
