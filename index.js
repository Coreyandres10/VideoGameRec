// app.js
const express = require("express");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const accessToken = require("./controllers/accessToken");

const {
  registerUser,
  loginUser,
  updateUser,
  removeUser,
} = require("./controllers/usersController");
const pageRouter = require("./routes/frontend.route");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Setup
const dbURI = process.env.MONGODB_URI;
console.log(dbURI)
mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

const store = new MongoDBStore({
  uri: dbURI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 7,
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // This allows any origin during development. Be more restrictive in production.
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type, Authorization"
  );

  if (req.session) {
    // Reset the session timeout when the user interacts with the server
    req.session._garbage = Date();
    req.session.touch();
    req.session.active = true;
    setTimeout(() => {
      if (req.session) {
        req.session.active = false;
      }
    }, 100);
  }

  next();
});

app.use("/", pageRouter);
app.post("/api/register", registerUser);
app.post("/login", loginUser);
app.post("/api/update-user/:userId", updateUser);
app.delete("/api/delete-user/:userId", removeUser);

const apiKey = "qbpekityglgneuruih7jkvh0iyf1m5";
app.post("/search-games-title", async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "text/plain",
      },
      body: `fields name; where name ~ "${searchTerm}"*;`,
    });

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      console.error("IGDB API request failed");
      res.status(500).json({ error: "API request failed" });
    }
  } catch (error) {
    console.error("An error occurred while fetching data from IGDB", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/search-games", async (req, res) => {
  const { firstTitle, secTitle } = req.body;
  const term = firstTitle.slice(0, 3);
  const term2 = secTitle.slice(0, 3);

  try {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "text/plain",
      },
      body: `fields id,summary,name,slug,url,rating,cover; where (cover != null & summary != null & rating != null & name ~ *"${term}"*  );`,
    });

    if (response.ok) {
      const data = await response.json();
      const coverPromises = data.map(async (game) => {
        if (game.cover) {
          const coverResponse = await fetch("https://api.igdb.com/v4/covers", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Client-ID": CLIENT_ID,
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "text/plain",
            },
            body: `fields url; where id = ${game.cover};`,
          });

          if (coverResponse.ok) {
            const coverData = await coverResponse.json();
            if (coverData.length > 0 && coverData[0].url) {
              game.cover_url = coverData[0].url;
            }
          }
        }
      });

      // Wait for all coverPromises to resolve
      await Promise.all(coverPromises);

      res.json(data);
    } else {
      console.error("IGDB API request failed");
      res.status(500).json({ error: "API request failed" });
    }
  } catch (error) {
    console.error("An error occurred while fetching data from IGDB", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/generate-token", async (req, res) => {
  const token = await accessToken.getAccessToken(CLIENT_ID, CLIENT_SECRET);
  res.json({ access_token: token });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
