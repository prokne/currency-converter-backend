import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import bodyParser from "body-parser";
//import convert from "./util/convert";
import { router as currenciesRouter } from "./routes/currencies";
import { router as convertRouter } from "./routes/convert";

const app = express();

app.use(bodyParser.json());
dotenv.config();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/currencies", currenciesRouter);
app.use("/convert", convertRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is listening to port " + process.env.PORT);
});
