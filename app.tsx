import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
dotenv.config();

app.get("/", async (req: Request, res: Response) => {
  //Generates list of currencies from currency API
  try {
    const data = await axios.get(
      "https://api.apilayer.com/fixer/symbols?apikey=" + process.env.APIKEY
    );

    let listofCurrencies: { shortcut: string; name: string }[] = [];
    for (const currency in data.data.symbols) {
      listofCurrencies.push({
        shortcut: currency,
        name: data.data.symbols[currency],
      });
    }
    res.status(200).send({
      message: "List of currencies fetched successfuly",
      data: listofCurrencies,
    });
  } catch (err: any) {
    res.send({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
