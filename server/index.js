const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./cron/overdueJob");





const app = express();
app.use("/api/dashboard", require("./routes/dashboard"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});


