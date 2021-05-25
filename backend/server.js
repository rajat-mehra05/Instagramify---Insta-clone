const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const morgan = require("morgan");
dotenv.config();
const PORT = process.env.PORT || 8080;

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

//models
require("./models/userModel");
require("./models/postModel");

//registering routes
app.use(require("./routes/authRoutes"));
app.use(require("./routes/postRoutes"));
app.use(require("./routes/userRoutes"));

const customMiddleware = (req, res, next) => {
  console.log("middleware");
  next();
};

app.get("/about", customMiddleware, (req, res) => {
  console.log("about");
  res.send("about page");
});

//production build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`.yellow.bold);
});

//midlleware is the code which accepts an incoming requests and
// modifies it before sending it to actual route.
