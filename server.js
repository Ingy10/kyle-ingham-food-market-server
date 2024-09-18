import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
