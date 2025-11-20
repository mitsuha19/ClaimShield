const express = require("express");
const app = express();
const notificationRoutes = require("./routes/notification");

app.use(express.json());

app.use("/api", notificationRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
