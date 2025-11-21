require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
app.use("/", indexRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced and tables created");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync error:", err);
  });
